class_name Bullet extends Area2D

const ASTEROID_HIT_PARTICLE = preload("res://scenes/particles/asteroid_hit_particle.tscn")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var timer: Timer = $Timer
@export var bullet_speed: float = 800.0
@export var bullet_hp: int = 1
@export var bullet_knockback: float = 100.0
@export var homing_distance: float = 400.0
var direction: Vector2
var velocity: Vector2
var target: DestructableObject = null 
var rotation_speed: float = 1.0

enum BulletOwner {
	PLAYER,
	ENEMY
}
var bullet_owner: BulletOwner = BulletOwner.ENEMY

var r = 0

func _physics_process(_delta: float) -> void:
	# Only runs every 60 frames
	if r == 0:
		target = get_closest_target()
	r += 1
	if r > 60:
		r = 0

func _process(delta: float) -> void:
	# Upgrades
	rotation_speed = min(Upgrades.get_level("homing") - 1, 8)
	bullet_knockback = Upgrades.get_level("punch") * 35
	
	if target == null: 
		target = get_closest_target()
	
	if target != null:
		var distance_to_target = global_position.distance_to(target.global_position)
		
		if distance_to_target <= homing_distance:
			# Calculate direction to the target
			var direction_to_target = (target.global_position - global_position).normalized()
			
			# Adjust velocity to turn towards the target
			velocity = velocity.lerp(direction_to_target * bullet_speed, rotation_speed * delta).normalized() * bullet_speed
	
	for body in get_overlapping_bodies():
		if body is DestructableObject:
			body.hit(1, self)
			bullet_hp -= 1
			if bullet_hp <= 0:
				get_parent().add_to_pool(self)
	
	
	# Update the bullet's rotation to match the direction of movement
	rotation = velocity.angle()
	
	# Update position
	position += velocity * delta

func _on_timer_timeout() -> void:
	animation_player.play("fade_out")

func _on_animation_player_animation_finished(anim_name: StringName) -> void:
	if anim_name != "RESET":
		get_parent().add_to_pool(self)
		

# find the closest DestructableObject
func get_closest_target() -> DestructableObject:
	var closest_target: DestructableObject = null
	var closest_distance: float = INF

	# Iterate through all children of the root node
	for node in GameManager.current_room.entities.get_children():
		if node is DestructableObject:
			var dist = global_position.distance_to(node.global_position)
			if dist < closest_distance:
				closest_distance = dist
				closest_target = node as DestructableObject  # Explicitly cast to DestructableObject
	return closest_target

func _pulled_from_pool():
	animation_player.play("RESET")
	timer.start()


func apply_velocity():
	velocity = direction * bullet_speed
	bullet_hp = Upgrades.get_level("piercing")
