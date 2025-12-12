// Teacher Create Lesson - Create a new lesson for a module
// NOTE: Enable "Requires Authentication" in Xano endpoint settings (select "users" table)
// Security: Auth ensures only logged-in users can create lessons
query "teacher/lessons" verb=POST {
  api_group = "all endpoints"
  auth = "users"

  input {
    int module_id
    text title filters=trim
    text slug filters=trim|lower
    text description?
    text content?
    text mux_playback_id?
    int duration?
    int order_index?
  }

  stack {
    // Create the lesson
    db.add lessons {
      data = {
        created_at     : "now"
        module         : $input.module_id
        title          : $input.title
        slug           : $input.slug
        description    : $input.description
        content        : $input.content
        mux_playback_id: $input.mux_playback_id
        duration       : $input.duration
        order_index    : $input.order_index
      }
    } as $lesson
  }

  response = {
    id             : $lesson.id
    module         : $lesson.module
    title          : $lesson.title
    slug           : $lesson.slug
    description    : $input.description
    content        : $input.content
    mux_playback_id: $input.mux_playback_id
    duration       : $input.duration
    order_index    : $lesson.order_index
    created_at     : $lesson.created_at
  }

  tags = ["teacher", "lessons"]
}
