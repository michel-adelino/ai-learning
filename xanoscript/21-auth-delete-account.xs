// Deletes the authenticated user and all associated data including courses, modules, lessons, and progress.
query delete_user_account verb=DELETE {
  api_group = "all endpoints"
  auth = "users"

  input {
  }

  stack {
    // Find all courses belonging to the user
    db.query courses {
      where = $db.courses.teacher == $auth.id
      return = {type: "list"}
    } as $user_courses
  
    // Find all modules belonging to the user's courses
    var $user_modules {
      value = []
    }
  
    foreach ($user_courses) {
      each as $course {
        db.query modules {
          where = $db.modules.course == $course.id
          return = {type: "list"}
        } as $course_modules
      
        var.update $user_modules {
          value = $user_modules|merge:$course_modules
        }
      }
    }
  
    // Delete all lessons associated with the found modules
    foreach ($user_modules) {
      each as $module {
        db.query lessons {
          where = $db.lessons.module == $module.id
          return = {type: "list"}
        } as $module_lessons
      
        foreach ($module_lessons) {
          each as $lesson {
            db.del lessons {
              field_name = "id"
              field_value = $lesson.id
            }
          }
        }
      }
    }
  
    // Delete the modules
    foreach ($user_modules) {
      each as $module {
        db.del modules {
          field_name = "id"
          field_value = $module.id
        }
      }
    }
  
    // Delete the courses
    foreach ($user_courses) {
      each as $course {
        db.del courses {
          field_name = "id"
          field_value = $course.id
        }
      }
    }
  
    // Delete user progress
    db.query user_progress {
      where = $db.user_progress.user == $auth.id
      return = {type: "list"}
    } as $progress_records
  
    foreach ($progress_records) {
      each as $record {
        db.del user_progress {
          field_name = "id"
          field_value = $record.id
        }
      }
    }
  
    // Delete the user account
    db.del users {
      field_name = "id"
      field_value = $auth.id
    }
  }

  response = {success: true}
  tags = ["auth"]
}