extends Node2D


const ASTEROID = preload("res://scenes/asteroid.tscn")
const EXPLOSIVE_ASTEROID = preload("res://scenes/explosive_asteroid.tscn")
func _on_timer_timeout() -> void:
	spawn_asteroid()

func spawn_asteroid():
	
	var new_position = global_position
	var new_asteroid = ASTEROID.instantiate()
	if randi_range(0,10) == 10:
		new_asteroid = EXPLOSIVE_ASTEROID.instantiate()
	
	new_asteroid.position = new_position
	new_asteroid.angular_velocity = randi_range(-10, 10)
	add_sibling(new_asteroid)
	
