-- ContentOS MVP Database Migration
-- Add translation_status field to postcards table
-- Run this in Supabase SQL Editor

-- Step 1: Add translation_status column to postcards table
ALTER TABLE postcards 
ADD COLUMN IF NOT EXISTS translation_status TEXT;

-- Step 2: Add check constraint for valid values
ALTER TABLE postcards
ADD CONSTRAINT translation_status_check 
CHECK (translation_status IN ('pending', 'processing', 'completed', 'failed') OR translation_status IS NULL);

-- Step 3: Set default value for existing records
-- Assume existing records with Swedish content are already translated
UPDATE postcards 
SET translation_status = CASE
    WHEN swedish_content IS NOT NULL AND swedish_content != '' THEN 'completed'
    ELSE 'pending'
END
WHERE translation_status IS NULL;

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_postcards_translation_status 
ON postcards(translation_status) 
WHERE translation_status IS NOT NULL;

-- Step 5: Add comment for documentation
COMMENT ON COLUMN postcards.translation_status IS 
'Status of Swedish translation: pending (needs translation), processing (currently translating), completed (translated), failed (translation error)';

-- Verification query - run this to check the migration worked
-- SELECT 
--     COUNT(*) as total_postcards,
--     COUNT(translation_status) as with_status,
--     SUM(CASE WHEN translation_status = 'completed' THEN 1 ELSE 0 END) as completed,
--     SUM(CASE WHEN translation_status = 'pending' THEN 1 ELSE 0 END) as pending
-- FROM postcards;