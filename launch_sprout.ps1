<#
.SYNOPSIS
  Sprout KinCare OS: Official Canonical Desktop Launcher
  Enforces Docker Compose as the exclusive runtime environment.
#>

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms

$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectDir

function Show-SproutMessage {
    param(
        [string]$Message,
        [string]$Title = "Sprout Command Center",
        [System.Windows.Forms.MessageBoxButtons]$Buttons = [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]$Icon = [System.Windows.Forms.MessageBoxIcon]::Information
    )
    [System.Windows.Forms.MessageBox]::Show($Message, $Title, $Buttons, $Icon) | Out-Null
}

try {
    # -------------------------------------------------------------
    # STEP 1: Verify Docker Desktop is running
    # -------------------------------------------------------------
    $dockerRunning = $false
    try {
        $null = & docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerRunning = $true
        }
    } catch {
        $dockerRunning = $false
    }

    if (-not $dockerRunning) {
        $dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        if (Test-Path $dockerDesktopPath) {
            Start-Process -FilePath $dockerDesktopPath
            # Wait up to 60 seconds for Docker Engine to initialize
            $timeoutSeconds = 60
            $elapsed = 0
            while ($elapsed -lt $timeoutSeconds) {
                Start-Sleep -Seconds 2
                $elapsed += 2
                try {
                    $null = & docker info 2>&1
                    if ($LASTEXITCODE -eq 0) {
                        $dockerRunning = $true
                        break
                    }
                } catch {}
            }
        }
        
        if (-not $dockerRunning) {
            Show-SproutMessage -Message "Docker Desktop is not running.`n`nPlease start Docker Desktop and launch Sprout again." -Title "Sprout - Docker Required" -Icon Warning
            exit 1
        }
    }

    # -------------------------------------------------------------
    # STEP 2: Verify sprout-app container is running
    # -------------------------------------------------------------
    $containerRunning = $false
    try {
        $runningContainers = (& docker compose ps --services --filter "status=running" 2>&1)
        if ($runningContainers -contains "sprout-app") {
            $containerRunning = $true
        }
    } catch {
        $containerRunning = $false
    }

    if (-not $containerRunning) {
        $upOutput = (& docker compose up -d 2>&1)
        if ($LASTEXITCODE -ne 0) {
            Show-SproutMessage -Message "Sprout container failed to start.`n`nError: $upOutput" -Title "Sprout Startup Error" -Icon Error
            exit 1
        }
    }

    # -------------------------------------------------------------
    # STEP 3: Verify port 5858 is responding
    # -------------------------------------------------------------
    $portReady = $false
    $portTimeout = 20
    $portElapsed = 0

    while ($portElapsed -lt $portTimeout) {
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $async = $tcp.BeginConnect("127.0.0.1", 5858, $null, $null)
            $wait = $async.AsyncWaitHandle.WaitOne(1000, $false)
            if ($wait -and $tcp.Connected) {
                $tcp.EndConnect($async)
                $tcp.Close()
                $portReady = $true
                break
            }
            $tcp.Close()
        } catch {}

        Start-Sleep -Seconds 1
        $portElapsed += 1
    }

    if (-not $portReady) {
        Show-SproutMessage -Message "Port 5858 unavailable.`n`nThe Sprout service did not respond within $portTimeout seconds." -Title "Sprout Connection Error" -Icon Error
        exit 1
    }

    # -------------------------------------------------------------
    # STEP 4: Launch default browser to http://127.0.0.1:5858
    # -------------------------------------------------------------
    Start-Process "http://127.0.0.1:5858"
    exit 0

} catch {
    Show-SproutMessage -Message "An unexpected error occurred while launching Sprout.`n`n$($_.Exception.Message)" -Title "Sprout Launcher Error" -Icon Error
    exit 1
}
