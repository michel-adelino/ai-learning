// Delete a lesson (teacher only)
query "teacher/lessons/{lessonId}" verb=DELETE {
  api_group = "all endpoints"
  auth = "users"

  input {
    int lessonId
  }

  stack {
    // Get the lesson
    db.get lessons {
      field_name = "id"
      field_value = $input.lessonId
    } as $lesson
  
    // Course/lesson/module existence & ownership checks (EXPRESSION mode)
    precondition ($lesson != null) {
      error_type = "inputerror"
      error = "Lesson not found"
      payload = $input.lessonId
    }
  
    // Get the module to find the course
    db.get modules {
      field_name = "id"
      field_value = $lesson.module
    } as $module
  
    precondition ($module != null) {
      error_type = "inputerror"
      error = "Module not found"
      payload = $module
    }
  
    // Verify course belongs to this teacher
    db.get courses {
      field_name = "id"
      field_value = $module.course
    } as $course
  
    precondition ($course != null) {
      error_type = "inputerror"
      error = "Course not found"
      payload = $course
    }
  
    precondition ($course.teacher == $auth.id) {
      error_type = "accessdenied"
      error = "You do not have permission to delete this lesson"
      payload = "$course.teacher != $auth.id"
    }
  
    // --- Safe deletion of user_progress: query then delete each record ---
    db.query user_progress {
      where = $db.user_progress.lesson == $input.lessonId
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
  
    // Delete the lesson
    db.del lessons {
      field_name = "id"
      field_value = $input.lessonId
    }
  
    var $response_data {
      value = {success: true, message: "Lesson deleted successfully"}
    }
  }

  response = $response_data
  tags = ["teacher", "lessons"]
}