// Get All Courses - Returns list of all courses with category info
query courses verb=GET {
  input {}

  stack {
    // Query all courses with category join
    db.query courses {
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
