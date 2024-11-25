class_name AsteroidPlayButton extends Asteroid
const LARGE_ASTEROID_DESTROY_PARTICLE = preload("res://scenes/particles/large_asteroid_destroy_particle.tscn")
func _ready() -> void:
	super._ready()

func destroy():
	super.destroy()
	call_deferred("change_scene")

func change_scene():
	TransitionLayer.change_scene("res://scenes/rooms/room.tscn")
