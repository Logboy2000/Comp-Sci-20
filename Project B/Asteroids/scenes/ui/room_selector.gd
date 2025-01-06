extends Panel

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("room_selector"):
		visible = !visible
		get_tree().paused = visible
	if Input.is_action_just_pressed("pause") and visible:
		visible = !visible
		get_tree().paused = visible
