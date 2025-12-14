// Delete a module and all its lessons
query "teacher/modules/{moduleId}" verb=DELETE {
  api_group = "all endpoints"
  auth = "users"

  input {
    int moduleId
  }

  stack {
    // Get the module
    db.get modules {
      field_name = "id"
      field_value = $input.moduleId
    } as $module
  
    precondition ($module != null) {
      error_type = "inputerror"
      error = "Module not found"
    }
  
    // Get the course to verify ownership
    db.get courses {
      field_name = "id"
      field_value = $module.course
    } as $course
  
    precondition ($course != null) {
      error_type = "inputerror"
      error = "Course not found"
    }
  
    precondition ($course.teacher == $auth.id) {
      error_type = "accessdenied"
      error = "You do not have permission to delete this module"
    }
  
    // Delete all lessons in this module
    db.query lessons {
      where = $db.lessons.module == $input.moduleId
      return = {type: "list"}
    } as $module_lessons
  
    foreach ($module_lessons) {
      each as $lesson {
        // --- Safe deletion of user_progress: query then delete each record ---
        db.query user_progress {
          where = $db.user_progress.lesson == $lesson.id
          return = {type: "list"}
        } as $progress_list
      
        foreach ($progress_list) {
          each as $progress {
            db.del user_progress {
              field_name = "id"
              field_value = $progress.id
            }
          }
        }
      
        db.del lessons {
          field_name = "id"
          field_value = $lesson.id
        }
      }
    }
  
    // Finally, delete the module
    db.del modules {
      field_name = "id"
      field_value = $input.moduleId
    }
  
    var $response_data {
      value = {
        success: true
        message: "Module and all associated lessons deleted successfully"
      }
    }
  }

  response = $response_data
  tags = ["teacher", "modules"]
}