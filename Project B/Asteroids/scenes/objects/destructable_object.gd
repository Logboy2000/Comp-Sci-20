class_name DestructableObject extends RigidBody2D

const COIN = preload("res://scenes/objects/collectables/coin.tscn")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var sprite: Sprite2D = $Sprite2D

@export var destroy_particle: PackedScene = preload("res://scenes/particles/asteroid_destroy_particle.tscn")
@export var hit_particle: PackedScene = preload("res://scenes/particles/asteroid_hit_particle.tscn")
@export var destroy_sound: AudioStream = preload("res://assets/Audio/asteroid_destroy.ogg")
@export var hit_sound: AudioStream = preload("res://assets/Audio/asteroid_hit.ogg")
@export var health: int = 2
@export var spawn_animation = false
@export var sprite_frames_for_health: bool = false
@export var dropped_coins = 0

func _ready() -> void:
	if spawn_animation:
		animation_player.play("spawn")
	if sprite_frames_for_health:
		health = sprite.hframes

func hit(damage: int = 1):
	health -= damage
	AudioPlayer.play_sound(hit_sound)
	if health <= 0:
		destroy()
	else:
		if sprite_frames_for_health:
			sprite.frame += damage
		var particle = hit_particle.instantiate()
		particle.position = global_position
		add_sibling(particle)

func destroy():
	AudioPlayer.play_sound(destroy_sound)
	for i in dropped_coins:
		var coin = COIN.instantiate()
		coin.position = global_position
		call_deferred("add_sibling", coin)
	var particle = destroy_particle.instantiate()
	particle.position = global_position
	add_sibling(particle)
	
	queue_free()
