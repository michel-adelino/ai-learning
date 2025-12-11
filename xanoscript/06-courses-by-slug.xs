// Get Course by Slug - Returns single course with modules and lessons
query courses/{slug} verb=GET {
  input {
    text slug
  }

  stack {
    // Get course by slug with category
    db.query courses {
      where = $db.courses.slug == $input.slug
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
      return = {type: "single"}
    } as $course

    precondition ($course != null) {
      error_type = "not_found"
      error = "Course not found."
    }

    // Get modules for this course
    db.query modules {
      where = $db.modules.course == $course.id
      sort = {modules.order_index: "asc"}
      return = {type: "list"}
    } as $modules

    // Get all lessons for all modules in one query
    db.query lessons {
      join = {
        modules: {
          table: "modules"
          where: $db.lessons.module == $db.modules.id
        }
      }
      where = $db.modules.course == $course.id
      sort = {lessons.order_index: "asc"}
      output = ["id", "title", "slug", "description", "duration", "order_index", "module"]
      return = {type: "list"}
    } as $allLessons
  }

  response = {
    id: $course.id,
    title: $course.title,
    slug: $course.slug,
    description: $course.description,
    image_url: $course.image_url,
    tier: $course.tier,
    featured: $course.featured,
    category: $course.category,
    modules: $modules,
    lessons: $allLessons
  }

  tags = ["courses"]
}
