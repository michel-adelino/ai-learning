// Teacher Create Course - Create a new course (teachers only)
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// NOTE: Frontend must always send tier value (default to "free" on frontend)
query "teacher/courses" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    text title filters=trim
    text slug filters=trim|lower
    text description filters=trim
    text image_url?
    int category?
    text tier filters=trim
  }

  stack {
    // Check if slug is unique
    db.get courses {
      field_name = "slug"
      field_value = $input.slug
    } as $existingCourse

    precondition ($existingCourse == null) {
      error_type = "inputerror"
      error = "A course with this slug already exists."
    }

    // Create the course
    db.add courses {
      data = {
        created_at: "now"
        title: $input.title
        slug: $input.slug
        description: $input.description
        image_url: $input.image_url
        category: $input.category
        tier: $input.tier
        featured: false
        teacher: $auth.id
        module_count: 0
        lesson_count: 0
      }
    } as $course
  }

  response = {
    id: $course.id
    title: $course.title
    slug: $course.slug
    description: $course.description
    image_url: $course.image_url
    category: $course.category
    tier: $course.tier
    featured: $course.featured
    teacher: $course.teacher
    created_at: $course.created_at
    module_count: 0
    lesson_count: 0
  }

  tags = ["teacher", "courses"]
}
