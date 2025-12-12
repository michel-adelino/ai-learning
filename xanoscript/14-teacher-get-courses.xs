// Teacher Get My Courses - Get all courses created by the teacher with modules/lessons
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
query "teacher/courses" verb=GET {
  api_group = "all endpoints"
  auth = "users"

  input {}

  stack {
    // Get all courses by this teacher
    db.query courses {
      where = $db.courses.teacher == $auth.id
      sort = {courses.created_at: "desc"}
    } as $courses

    // Get all modules for teacher's courses
    db.query modules {
      join = {
        courses: {
          table: "courses"
          where: $db.modules.course == $db.courses.id
        }
      }
      where = $db.courses.teacher == $auth.id
      sort = {modules.order_index: "asc"}
    } as $allModules

    // Get all lessons for teacher's courses
    db.query lessons {
      join = {
        modules: {
          table: "modules"
          where: $db.lessons.module == $db.modules.id
        }
        courses: {
          table: "courses"
          where: $db.modules.course == $db.courses.id
        }
      }
      where = $db.courses.teacher == $auth.id
      sort = {lessons.order_index: "asc"}
    } as $allLessons
  }

  response = {
    courses: $courses
    modules: $allModules
    lessons: $allLessons
  }

  tags = ["teacher", "courses"]
}
