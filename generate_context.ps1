$out = "d:\unmarky\project_context.md";
"# Project Context`n" | Out-File -FilePath $out -Encoding utf8;

$rootFiles = @("d:\unmarky\apps\web\package.json", "d:\unmarky\apps\web\tsconfig.json", "d:\unmarky\apps\web\vite.config.ts", "d:\unmarky\apps\web\index.html");

foreach ($path in $rootFiles) {
    if (Test-Path $path) {
        $relPath = $path.Replace("d:\unmarky\", "");
        $ext = [System.IO.Path]::GetExtension($path).TrimStart('.');
        
        "`n## File: $relPath`n```$ext`n" | Out-File -FilePath $out -Append -Encoding utf8;
        Get-Content $path | Out-File -FilePath $out -Append -Encoding utf8;
        "`n```" | Out-File -FilePath $out -Append -Encoding utf8;
    }
}

$extensions = @("*.ts", "*.tsx", "*.css", "*.json");
$srcFiles = Get-ChildItem -Path "d:\unmarky\apps\web\src" -Recurse -Include $extensions;

foreach ($file in $srcFiles) {
    $relPath = $file.FullName.Replace("d:\unmarky\", "");
    $ext = $file.Extension.TrimStart('.');
    
    "`n## File: $relPath`n```$ext`n" | Out-File -FilePath $out -Append -Encoding utf8;
    Get-Content $file.FullName | Out-File -FilePath $out -Append -Encoding utf8;
    "`n```" | Out-File -FilePath $out -Append -Encoding utf8;
}

Write-Host "Context file generated at $out";
