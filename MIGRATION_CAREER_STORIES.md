# Career Stories Category Migration

This document outlines the changes made to restructure the career stories section to use specific categories.

## Changes Made

### 1. Database Schema Changes

- Modified `Post` model to use single `category` field instead of `categories` array
- Changed from `categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]` to `category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }`

### 2. New Categories Added

Added three new categories specifically for career stories:

- `resume-tips` - Resume Tips
- `interview-tips` - Interview Tips
- `technical-tips` - Technical Tips

### 3. Backend API Changes

- Updated all routes in `backend/routes/blog.js` to handle single `category` field
- Modified validation schemas to accept single category string instead of array
- Updated populate calls to use `category` instead of `categories`
- Maintained backward compatibility for multi-category queries using `categories` parameter

### 4. Frontend Changes

- Updated admin dashboard forms to use single category select dropdown
- Added new categories to `PRESET_CATEGORIES` array
- Modified form field from `categories` to `category`
- Updated CareerStories component to group posts by category into three columns

### 5. CareerStories Component Updates

- Changed from 3-column layout based on index to category-based columns
- Each column now represents a specific category: Resume Tips, Interview Tips, Technical Tips
- Updated post tags to show category name instead of generic "CAREER STORY"
- Increased fetch limit to 50 posts to ensure all categories are populated

## Migration Steps Required

### 1. Seed New Categories

Run the category seeding script to create the new categories:

```bash
# Using the API script (requires admin JWT token)
./backend/scripts/seedCategoriesAPI.sh <API_BASE_URL> <ADMIN_JWT_TOKEN>

# Or using the direct DB script (requires MongoDB connection)
cd backend && node scripts/seedCareerStoryCategories.js
```

### 2. Data Migration

Existing posts with multiple categories need to be migrated to use single category:

```javascript
// Example migration script (run in MongoDB shell or via script)
// This should be customized based on business logic for category selection
db.posts
  .find({ categories: { $exists: true, $ne: [] } })
  .forEach(function (post) {
    if (post.categories && post.categories.length > 0) {
      // Use first category or apply custom logic
      db.posts.updateOne(
        { _id: post._id },
        {
          $set: { category: post.categories[0] },
          $unset: { categories: "" },
        }
      );
    }
  });
```

### 3. Test Categories

After seeding, verify categories exist:

- Check admin dashboard category dropdown shows new options
- Create test career stories with each category
- Verify CareerStories component displays posts in correct columns

## Rollback Plan

If rollback is needed:

1. Revert Post model to use `categories` array field
2. Update API routes back to handle categories array
3. Revert frontend forms to multi-select dropdowns
4. Restore original CareerStories component logic

## Testing Checklist

- [ ] New categories appear in admin dashboard dropdown
- [ ] Can create posts with resume-tips category
- [ ] Can create posts with interview-tips category
- [ ] Can create posts with technical-tips category
- [ ] CareerStories page shows three columns with proper category headers
- [ ] Posts appear in correct category columns
- [ ] Post tags show category names correctly
- [ ] Existing posts still work (after migration)
- [ ] Edit functionality works with single category selection
