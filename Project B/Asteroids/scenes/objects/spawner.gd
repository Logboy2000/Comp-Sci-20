extends Node2D

@export var asteroid_velocity: Vector2 = Vector2.ZERO
@export var spawn_delay_seconds: float = 1

@onready var particles: GPUParticles2D = $GPUParticles2D
@onready var timer: Timer = $Timer

const DESTRUCTABLE_OBJECTS = [
	preload("res://scenes/objects/asteroids/explosive_asteroid.tscn"),
	preload("res://scenes/objects/asteroids/asteroid.tscn"),
	preload("res://scenes/objects/enemies/enemy_0.tscn"),
]


func _ready() -> void:
	timer.wait_time = spawn_delay_seconds
	particles.process_material.initial_velocity_max = asteroid_velocity.length() / 20

func _on_timer_timeout() -> void:
	var new_object = DESTRUCTABLE_OBJECTS.pick_random().instantiate()
	new_object.linear_velocity = asteroid_velocity
	new_object.position = global_position + Vector2(randi_range(-100,100), randi_range(-100,100))
	new_object.angular_velocity = randi_range(-10, 10)
	new_object.spawn_animation = true
	add_sibling(new_object)
