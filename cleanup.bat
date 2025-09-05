@echo off
echo Cleaning up ContentOS MVP project files...
echo.

echo Removing test scripts...
del test-api-fixes.js 2>nul
del test-feature-checklist.js 2>nul
del test-generation.js 2>nul
del test-optimized-generation.js 2>nul

echo Removing duplicate and temporary files...
del env.local 2>nul
del nul 2>nul
del claude-tasks.md 2>nul
del context.md 2>nul

echo.
echo Cleanup complete!
echo.
echo Files kept:
echo - FINAL-IMPLEMENTATION-REPORT.md (important documentation)
echo - supabase-migration.sql (needed for database update)
echo - CLAUDE.md (project guidance)
echo - README.md (project documentation)
echo.
pause