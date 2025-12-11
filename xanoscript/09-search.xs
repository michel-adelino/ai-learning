// Search - Search courses and lessons
// NOTE: XanoScript has limited text search support.
// After creating this endpoint, use Xano's Visual Builder to:
// 1. Add a "Search" addon for full-text search capability
// 2. Or use the External Filter feature for LIKE queries
//
// This basic version filters using exact substring match via direct query.

query search verb=GET {
  input {
    text q filters=trim
  }

  stack {
    // Use direct SQL query for LIKE search on courses
    db.direct_query {
      sql = "SELECT c.id, c.title, c.slug, c.description, c.image_url, c.tier, cat.id as category_id, cat.title as category_title FROM courses c LEFT JOIN categories cat ON c.category = cat.id WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', ?, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', ?, '%')) LIMIT 10"
      arg = $input.q
      arg = $input.q
      response_type = "list"
    } as $courseResults

    // Use direct SQL query for LIKE search on lessons
    db.direct_query {
      sql = "SELECT l.id, l.title, l.slug, l.description, l.duration, m.title as module_title, c.title as course_title, c.slug as course_slug, c.tier as course_tier FROM lessons l JOIN modules m ON l.module = m.id JOIN courses c ON m.course = c.id WHERE LOWER(l.title) LIKE LOWER(CONCAT('%', ?, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', ?, '%')) LIMIT 20"
      arg = $input.q
      arg = $input.q
      response_type = "list"
    } as $lessonResults
  }

  response = {
    courses: $courseResults,
    lessons: $lessonResults
  }

  tags = ["search"]
}
