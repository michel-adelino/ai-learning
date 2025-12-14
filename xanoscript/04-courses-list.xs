// Get All Courses - Returns list of all courses with modules and lessons
query courses verb=GET {
  input {}

  stack {
    // Query all courses
    db.query courses {
      sort = {courses.id: "desc"}
    } as $courses

    // Get all modules
    db.query modules {
      sort = {modules.order_index: "asc"}
    } as $allModules

    // Get all lessons
    db.query lessons {
      sort = {lessons.order_index: "asc"}
    } as $allLessons
    
    // Also fetch users so we can attach teacher names on the client if desired
    db.query users {
      sort = {users.id: "asc"}
    } as $allUsers
  }

  response = {
    courses: $courses
    modules: $allModules
    lessons: $allLessons
    users: $allUsers
  }

  tags = ["courses"]
}
