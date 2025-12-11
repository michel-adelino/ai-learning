// Get Lesson by Slug - Returns lesson with full content
query lessons/{slug} verb=GET {
  input {
    text slug
  }

  stack {
    // Get lesson by slug
    db.query lessons {
      where = $db.lessons.slug == $input.slug
      return = {type: "single"}
    } as $lesson

    precondition ($lesson != null) {
      error_type = "not_found"
      error = "Lesson not found."
    }

    // Get the module this lesson belongs to
    db.get modules {
      field_name = "id"
      field_value = $lesson.module
    } as $module

    // Get the course this module belongs to
    db.query courses {
      where = $db.courses.id == $module.course
      join = {
        categories: {
          table: "categories"
          where: $db.courses.category == $db.categories.id
        }
      }
      eval = {
        category: {
          id: $db.categories.id,
          title: $db.categories.title
        }
      }
      return = {type: "single"}
    } as $course

    // Get all modules for the course
    db.query modules {
      where = $db.modules.course == $course.id
      sort = {modules.order_index: "asc"}
      return = {type: "list"}
    } as $allModules

    // Get all lessons for the course (for sidebar navigation)
    db.query lessons {
      join = {
        modules: {
          table: "modules"
          where: $db.lessons.module == $db.modules.id
        }
      }
      where = $db.modules.course == $course.id
      sort = {lessons.order_index: "asc"}
      output = ["id", "title", "slug", "duration", "order_index", "module"]
      return = {type: "list"}
    } as $allLessons
  }

  response = {
    id: $lesson.id,
    title: $lesson.title,
    slug: $lesson.slug,
    description: $lesson.description,
    content: $lesson.content,
    mux_playback_id: $lesson.mux_playback_id,
    duration: $lesson.duration,
    order_index: $lesson.order_index,
    module: $module,
    course: {
      id: $course.id,
      title: $course.title,
      slug: $course.slug,
      tier: $course.tier,
      category: $course.category,
      modules: $allModules,
      all_lessons: $allLessons
    }
  }

  tags = ["lessons"]
}
