extends Node2D
const EXPLOSIVE_ASTEROID = preload("res://scenes/objects/explosive_asteroid.tscn")
const ASTEROID = preload("res://scenes/objects/asteroid.tscn")
const SPAWN_AUDIO = preload("res://assets/Audio/spawn.wav")

@export var asteroid_velocity: Vector2 = Vector2.ZERO
@onready var particles: GPUParticles2D = $GPUParticles2D

func _ready() -> void:
	particles.process_material.initial_velocity_max = asteroid_velocity.length() / 20

func _on_timer_timeout() -> void:
	spawn_asteroid()

func spawn_asteroid():
	AudioPlayer.play_sound(SPAWN_AUDIO)
	var new_position = global_position
	var new_asteroid = ASTEROID.instantiate()
	if randi_range(0,10) == 10:
		new_asteroid = EXPLOSIVE_ASTEROID.instantiate()
	new_asteroid.linear_velocity = asteroid_velocity
	new_asteroid.position = new_position
	new_asteroid.angular_velocity = randi_range(-10, 10)
	new_asteroid.spawn_animation = true
	add_sibling(new_asteroid)
	
