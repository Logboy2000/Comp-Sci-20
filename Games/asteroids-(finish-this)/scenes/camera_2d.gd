extends Camera2D

const zoom_mult = 1.1

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("zoom_in"):
		zoom *= zoom_mult
	if Input.is_action_just_pressed("zoom_out"):
		zoom /= zoom_mult
