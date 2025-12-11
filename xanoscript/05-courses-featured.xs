// Get Featured Courses - Returns featured courses for homepage
query courses/featured verb=GET {
  input {}

  stack {
    // Query featured courses with category join
    db.query courses {
      where = $db.courses.featured == true
      join = {
        categories: {
          table: "categories"
          where: $db.courses.category == $db.categories.id
        }
      }
      eval = {
        category: {
          id: $db.categories.id,
          title: $db.categories.title,
          slug: $db.categories.slug
        }
      }
      sort = {courses.id: "desc"}
      output = [
        "id",
        "title",
        "slug",
        "description",
        "image_url",
        "tier",
        "featured",
        "category"
      ]
      return = {type: "list"}
    } as $courses
  }

  response = $courses

  tags = ["courses"]
}
