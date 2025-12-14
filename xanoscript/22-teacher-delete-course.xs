// Delete course and all related data
query "delete_course/{course_id}" verb=DELETE {
  api_group = "all endpoints"
  auth = "users"

  input {
    int course_id
  }

  stack {
    db.get courses {
      field_name = "id"
      field_value = $input.course_id
    } as $course
  
    precondition ($course != null || $course.id != null) {
      error_type = "inputerror"
      error = "Course not found"
      payload = $input.course_id
    }
  
    precondition ($course.teacher == $auth.id) {
      error_type = "accessdenied"
      error = "You do not have permission to delete this course"
      payload = $input.course_id
    }
  
    db.query modules {
      where = $db.modules.course == $input.course_id
      return = {type: "list"}
    } as $modules
  
    foreach ($modules) {
      each as $module {
        db.query lessons {
          where = $db.lessons.module == $module.id
          return = {type: "list"}
        } as $lessons
      
        foreach ($lessons) {
          each as $lesson {
            db.del user_progress {
              field_name = "lesson"
              field_value = $lesson.id
            }
          
            db.del lessons {
              field_name = "id"
              field_value = $lesson.id
            }
          }
        }
      
        db.del modules {
          field_name = "id"
          field_value = $module.id
        }
      }
    }
  
    db.del courses {
      field_name = "id"
      field_value = $input.course_id
    }
  
    var $response_data {
      value = {success: true, message: "Course deleted successfully"}
    }
  }

  response = $response_data
  tags = ["teacher", "courses"]
}