class_name Asteroid extends RigidBody2D

const ASTEROID_EXPLOSION_PARTICLE = preload("res://scenes/particles/asteroid_destroy_particle.tscn")

@export var HIT_SOUND: AudioStream
@export var DESTROY_SOUND: AudioStream

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var sprite: Sprite2D = $Sprite2D

@export var health: int = 2

func _ready() -> void:
	animation_player.play("spawn")
	health = sprite.hframes

func hit(damage: int = 1):
	health -= damage
	if health <= 0:
		destroy()
		queue_free()
	else:
		sprite.frame += 1
		AudioPlayer.play_sound(HIT_SOUND)

func destroy():
	AudioPlayer.play_sound(DESTROY_SOUND)
	var particle = ASTEROID_EXPLOSION_PARTICLE.instantiate()
	particle.position = global_position
	add_sibling(particle)
