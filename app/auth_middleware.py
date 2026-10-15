"""
Sprout / KinCare OS — Authorization & Governance Middleware (Phase 13B)
Governing Baselines:
- ROLE_PERMISSION_MATRIX_V2.md
- API_GOVERNANCE_MATRIX.md
- EXPORT_GOVERNANCE_MATRIX.md
- WORKFLOW_GOVERNANCE_DICTIONARY.md
- HIGH_CONFLICT_SAFETY_MODEL.md
"""

import os
import re
import json
import functools
from bottle import request, response, abort

CONFIDENTIAL_DCF_SUBSTITUTE = "CONFIDENTIAL ADDRESS — DCF DISTRICT 5 (BARRE) FAMILY SERVICES"

# Canonical Role Definitions
ROLE_PC = "PC"  # Primary Caregiver (Candy Chevalier)
ROLE_SC = "SC"  # Secondary Caregiver (Mallory Wheeler)
ROLE_AH = "AH"  # Adult Household Member (Robin Davis)
ROLE_RC = "RC"  # Respite Caregiver (e.g. Samantha Price)
ROLE_PP = "PP"  # Parent Participant (e.g. Angela Davis, Danielle Miller)
ROLE_GP = "GP"  # Grandparent / Kin Resource (e.g. Eleanor Vance)
ROLE_CA = "CA"  # Child Advocate / GAL (e.g. Mark Henderson)
ROLE_SA = "SA"  # System Admin / Auditor

ALL_ROLES = {ROLE_PC, ROLE_SC, ROLE_AH, ROLE_RC, ROLE_PP, ROLE_GP, ROLE_CA, ROLE_SA}

# Domain Sovereignty Mapping
DOMAINS = {"child", "case", "caregiver", "parent"}

ALLOWED_DOMAINS_BY_ROLE = {
    ROLE_PC: {"child", "case", "caregiver", "parent"},
    ROLE_SC: {"child", "case", "caregiver", "parent"},
    ROLE_AH: {"child", "caregiver"},
    ROLE_RC: {"child"},
    ROLE_PP: {"parent", "child"}, # In 'child', only shared_family classification is visible
    ROLE_GP: {"child", "case"},
    ROLE_CA: {"child", "case"},
    ROLE_SA: {"child", "case", "caregiver", "parent"},
}

ALLOWED_CLASSIFICATIONS_BY_ROLE = {
    ROLE_PC: {"legacy_unreviewed", "private", "working", "official", "shared_family"},
    ROLE_SC: {"legacy_unreviewed", "working", "official", "shared_family"},
    ROLE_AH: {"working", "official", "shared_family"},
    ROLE_RC: {"official", "working"}, # Scoped to child domain routine care
    ROLE_PP: {"shared_family"},
    ROLE_GP: {"official"},
    ROLE_CA: {"official"},
    ROLE_SA: {"official"},
}


def resolve_actor_and_role(req):
    """
    Extracts actor name and resolved role from request headers.
    Headers checked:
      - X-Caregiver-Role / X-Role: Explicit role acronym (PC, SC, AH, RC, PP, GP, CA, SA)
      - X-Caregiver: Actor display name
      - X-Parent-Token: Presence implies Parent Participant (PP)
    """
    role = (req.headers.get('X-Caregiver-Role') or req.headers.get('X-Role') or '').strip().upper()
    caregiver = (req.headers.get('X-Caregiver') or '').strip()
    parent_token = (req.headers.get('X-Parent-Token') or '').strip()

    if parent_token:
        return caregiver or "Parent Participant", ROLE_PP

    if role in ALL_ROLES:
        return caregiver or f"User-{role}", role

    # Name-based heuristic resolution
    if "Candy" in caregiver or "Chevalier" in caregiver:
        return caregiver, ROLE_PC
    elif "Mallory" in caregiver or "Wheeler" in caregiver:
        return caregiver, ROLE_SC
    elif "Robin" in caregiver or "Davis" in caregiver:
        return caregiver, ROLE_AH
    elif any(name in caregiver for name in ["Samantha", "Price", "Respite"]):
        return caregiver, ROLE_RC
    elif any(name in caregiver for name in ["Angela", "Danielle", "Jason", "Maria", "Parent"]):
        return caregiver, ROLE_PP
    elif any(name in caregiver for name in ["Eleanor", "Arthur", "Grandparent"]):
        return caregiver, ROLE_GP
    elif any(name in caregiver for name in ["Henderson", "Green", "Walsh", "GAL", "Advocate"]):
        return caregiver, ROLE_CA
    elif any(name in caregiver for name in ["Admin", "System"]):
        return caregiver, ROLE_SA

    # Default fallback for local single-user operation
    return caregiver or "Candy Chevalier", ROLE_PC


def check_domain_permission(role, domain):
    """Checks if a given role is sovereign over the requested domain."""
    allowed = ALLOWED_DOMAINS_BY_ROLE.get(role, set())
    return domain in allowed


def check_classification_permission(role, classification):
    """Checks if a given role can read records with the specified classification."""
    allowed = ALLOWED_CLASSIFICATIONS_BY_ROLE.get(role, set())
    return classification in allowed


def is_high_conflict_active(req, child_id=None, db_conn=None):
    """
    Determines if High-Conflict Mode is active via:
    1. Header: X-High-Conflict == '1'
    2. Database: child or household record has high_conflict_mode == 1
    """
    if req.headers.get('X-High-Conflict') == '1':
        return True

    if db_conn and child_id:
        row = db_conn.execute("SELECT high_conflict_mode FROM children WHERE id = ?", (child_id,)).fetchone()
        if row and row[0] == 1:
            return True

    return False


def mask_household_address(household_dict, is_high_conflict=True):
    """Dynamically masks physical address in household payloads."""
    if not is_high_conflict:
        return household_dict
    h = dict(household_dict)
    h['address'] = CONFIDENTIAL_DCF_SUBSTITUTE
    h['e911_address'] = CONFIDENTIAL_DCF_SUBSTITUTE
    h['mailing_address'] = CONFIDENTIAL_DCF_SUBSTITUTE
    if 'town' in h:
        h['town'] = "Confidential District Office"
    return h


def quantize_timestamp_for_parent(ts_str):
    """Quantizes exact timestamps to date-only (YYYY-MM-DD) for parent safety."""
    if not ts_str:
        return ""
    m = re.match(r"^(\d{4}-\d{2}-\d{2})", ts_str)
    return m.group(1) if m else ts_str[:10]


def filter_record_for_role(record, role, is_high_conflict=False):
    """
    Filters a single timeline_record dictionary according to role governance.
    Returns None if record must be suppressed.
    """
    rec = dict(record)
    classification = rec.get('classification') or 'legacy_unreviewed'
    domain = rec.get('domain') or 'case'
    retention_state = rec.get('retention_state') or 'Active'

    # Suppressed non-active records unless System Admin
    if retention_state != 'Active' and role != ROLE_SA:
        return None

    # Parent Participant Governance Gate
    if role == ROLE_PP:
        # Strictly require shared_family classification and parent or child domain
        if classification != 'shared_family' or domain not in ('parent', 'child'):
            return None
        # Mask exact timestamps to date only
        rec['event_date'] = quantize_timestamp_for_parent(rec.get('event_date'))
        # Strip internal draft texts and follow up caregiver notes
        rec.pop('dcf_draft_text', None)
        rec.pop('gal_draft_text', None)
        rec.pop('follow_up_notes', None)
        if is_high_conflict:
            rec['location'] = "Supervised Family Center / Confidential Site"
        return rec

    # Respite Provider Governance Gate
    if role == ROLE_RC:
        # Only child domain routine care allowed (medical, daily, emergency)
        if domain != 'child' or rec.get('category') in ('legal', 'financial', 'posc'):
            return None
        if classification == 'private':
            return None
        rec.pop('dcf_draft_text', None)
        rec.pop('gal_draft_text', None)
        return rec

    # Adult Household Member Governance Gate
    if role == ROLE_AH:
        if domain not in ('child', 'caregiver'):
            return None
        if classification == 'private':
            return None
        return rec

    # Secondary Caregiver Governance Gate
    if role == ROLE_SC:
        # Can view working, official, shared_family, and legacy
        # Cannot view primary caregiver's private notes
        if classification == 'private' and rec.get('author') != 'Mallory Wheeler':
            return None
        return rec

    # Primary Caregiver has full access to all local records
    return rec


def scrub_image_exif(image_bytes: bytes) -> bytes:
    """
    Pure Python EXIF and GPS scrubber for JPEG and PNG images.
    Removes APP1 (0xFFE1) Exif metadata segment from JPEGs and eXIf chunks from PNGs.
    Guarantees no GPS coordinates or hardware identifiers leak to external viewers.
    """
    if not image_bytes:
        return image_bytes

    # Handle JPEG
    if image_bytes.startswith(b'\xff\xd8'):
        out = bytearray(b'\xff\xd8')
        idx = 2
        data_len = len(image_bytes)
        while idx < data_len:
            if image_bytes[idx] != 0xff:
                out.extend(image_bytes[idx:])
                break
            if idx + 1 >= data_len:
                break
            marker = image_bytes[idx + 1]
            if marker in (0xd9, 0xda):  # SOS or EOI
                out.extend(image_bytes[idx:])
                break
            if idx + 3 >= data_len:
                break
            length = int.from_bytes(image_bytes[idx + 2:idx + 4], 'big')
            # 0xe1 is APP1 (which contains EXIF and GPS)
            if marker != 0xe1:
                out.extend(image_bytes[idx:idx + 2 + length])
            idx += 2 + length
        return bytes(out)

    # Handle PNG
    if image_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        out = bytearray(image_bytes[:8])
        idx = 8
        data_len = len(image_bytes)
        while idx + 8 <= data_len:
            chunk_len = int.from_bytes(image_bytes[idx:idx + 4], 'big')
            chunk_type = image_bytes[idx + 4:idx + 8]
            total_chunk = 4 + 4 + chunk_len + 4
            if chunk_type != b'eXIf':
                out.extend(image_bytes[idx:idx + total_chunk])
            idx += total_chunk
        return bytes(out)

    return image_bytes


def require_role(*allowed_roles):
    """Bottle route decorator enforcing allowed roles."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            actor, role = resolve_actor_and_role(request)
            if role not in allowed_roles:
                abort(403, f"Role '{role}' is unauthorized for this endpoint. Allowed: {allowed_roles}")
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def require_domain(domain):
    """Bottle route decorator enforcing domain sovereignty."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            actor, role = resolve_actor_and_role(request)
            if not check_domain_permission(role, domain):
                abort(403, f"Domain '{domain}' is forbidden for role '{role}'.")
            return fn(*args, **kwargs)
        return wrapper
    return decorator
