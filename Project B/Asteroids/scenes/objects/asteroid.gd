class_name Asteroid extends RigidBody2D

const ASTEROID_EXPLOSION_PARTICLE = preload("res://scenes/particles/asteroid_destroy_particle.tscn")
const COIN = preload("res://scenes/objects/coin.tscn")

@export var DESTROY_SOUND: AudioStream

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var sprite: Sprite2D = $Sprite2D

@export var health: int = 2

@export var spawn_animation = false
@export var dropped_coins = 0

func _ready() -> void:
	if spawn_animation:
		animation_player.play("spawn")
	health = sprite.hframes

func hit(damage: int = 1):
	GameManager.shake_camera(0.5)
	health -= damage
	if health <= 0:
		destroy()
		
	else:
		sprite.frame += damage

func destroy():
	GameManager.shake_camera(6)
	AudioPlayer.play_sound(DESTROY_SOUND)
	for i in dropped_coins:
		var coin = COIN.instantiate()
		coin.position = global_position
		call_deferred("add_sibling", coin)
	var particle = ASTEROID_EXPLOSION_PARTICLE.instantiate()
	particle.position = global_position
	add_sibling(particle)
	
	queue_free()
