class_name DestructableObject extends RigidBody2D

const COIN = preload("res://scenes/objects/collectables/coin.tscn")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var sprite: Sprite2D = $Sprite2D
@export var destroy_particle: PackedScene = preload("res://scenes/particles/asteroid_destroy_particle.tscn")
@export var hit_particle: PackedScene = preload("res://scenes/particles/asteroid_hit_particle.tscn")
@export var destroy_sound: AudioStream = preload("res://assets/audio/asteroid_destroy.ogg")
@export var hit_sound: AudioStream = preload("res://assets/audio/asteroid_hit.ogg")
@export var health: int = 2
@export var spawn_animation = false
@export var sprite_frames_for_health: bool = false
@export var dropped_coins = 0
var hit_this_frame: bool = false
func _ready() -> void:
	if spawn_animation:
		animation_player.play("spawn")
	if sprite_frames_for_health:
		health = sprite.hframes

func _process(_delta: float) -> void:
	hit_this_frame = false

func hit(damage: int, damage_source_node: Node2D, knockback_force: float = 30):
	if not hit_this_frame:
		hit_this_frame = true
		health -= damage
		
		if health <= 0:
			destroy()
		else:
			if sprite_frames_for_health:
				sprite.frame += damage
			var particle = hit_particle.instantiate()
			particle.position = global_position
			add_sibling(particle)
			Audio.play_sound(hit_sound)
			
			# Get bullet velocity or knockback force depending on the damage source
			var bullet_velocity = Vector2.ZERO
			if damage_source_node is Player:
				bullet_velocity = damage_source_node.velocity
			elif damage_source_node is Bullet:
				# If bullet_knockback is a scalar (float), we need a direction to apply it
				var bullet_knockback_direction = damage_source_node.velocity.normalized()  # Assuming the bullet's velocity determines the direction
				bullet_velocity = bullet_knockback_direction * damage_source_node.bullet_knockback  # Apply scalar force to the direction
			
			# Calculate the knockback direction using the bullet's velocity
			var knockback_direction = bullet_velocity.normalized()
			
			# Apply the knockback force, adding the bullet's velocity length (speed) for a stronger knockback
			linear_velocity += knockback_direction * (knockback_force + bullet_velocity.length())
			
			# Smoothly adjust the angular velocity to match the knockback direction
			angular_velocity = lerp_angle(rotation, knockback_direction.angle(), 0.1)  # Adjust speed here if necessary






	

func destroy():
	Audio.play_sound(destroy_sound)
	for i in dropped_coins:
		var coin = COIN.instantiate()
		coin.position = global_position
		call_deferred("add_sibling", coin)
	var particle = destroy_particle.instantiate()
	particle.position = global_position
	add_sibling(particle)
	
	queue_free()
