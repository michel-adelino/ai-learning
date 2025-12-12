// Get Course by Slug - Returns single course with modules and lessons
query courses/{slug} verb=GET {
  input {
    text slug
  }

  stack {
    // Get course by slug
    db.get courses {
      field_name = "slug"
      field_value = $input.slug
    } as $course

    precondition ($course != null) {
      error_type = "inputerror"
      error = "Course not found."
    }

    // Get modules for this course
    db.query modules {
      where = $db.modules.course == $course.id
      sort = {modules.order_index: "asc"}
    } as $modules

    // Get all lessons for all modules
    db.query lessons {
      join = {
        modules: {
          table: "modules"
          where: $db.lessons.module == $db.modules.id
        }
      }
      where = $db.modules.course == $course.id
      sort = {lessons.order_index: "asc"}
    } as $allLessons
  }

  response = {
    id: $course.id
    title: $course.title
    slug: $course.slug
    description: $course.description
    image_url: $course.image_url
    tier: $course.tier
    featured: $course.featured
    category: $course.category
    modules: $modules
    lessons: $allLessons
  }

  tags = ["courses"]
}
