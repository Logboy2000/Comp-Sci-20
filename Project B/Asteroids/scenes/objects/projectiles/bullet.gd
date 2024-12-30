class_name Bullet extends Area2D

const ASTEROID_HIT_PARTICLE = preload("res://scenes/particles/asteroid_hit_particle.tscn")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@export var bullet_speed: float = 700
@export var bullet_hp: int = 1
@export var bullet_knockback: float = 100.0
@export var homing_distance: float = 300.0 
var direction: Vector2
var velocity: Vector2
var target: DestructableObject = null 
var rotation_speed: float = 5.0

enum BulletOwner {
	PLAYER,
	ENEMY
}
var bullet_owner: BulletOwner = BulletOwner.ENEMY

func _ready() -> void:
	velocity = direction * bullet_speed
	bullet_hp = Upgrades.get_level("piercing")
	connect("area_entered", Callable(self, "_on_body_entered"))

	# Find the closest target, no need for groups
	target = get_closest_target()

func _physics_process(delta: float) -> void:
	# UUpgrades
	homing_distance = Upgrades.get_level("homing")-1 * 40
	bullet_knockback = Upgrades.get_level("punch") * 35
	
	if target == null: 
		target = get_closest_target()
	
	if target != null:
		var distance_to_target = global_position.distance_to(target.global_position)
		
		if distance_to_target <= homing_distance:
			var direction_to_target = (target.global_position - global_position).normalized()
			velocity = velocity.lerp(direction_to_target * bullet_speed, rotation_speed * delta)

	# Update the bullet's rotation to match the direction of movement
	rotation = velocity.angle()

	# Update position
	position += velocity * delta

func _on_timer_timeout() -> void:
	animation_player.play("fade_out")

func _on_animation_player_animation_finished(_anim_name: StringName) -> void:
	queue_free()

func _on_body_entered(body: Node2D) -> void:
	if body is DestructableObject or body is TileMapLayer:
		if body is DestructableObject or body is Player:
			body.hit(1, self)
		bullet_hp -= 1
		if bullet_hp <= 0:
			queue_free()

# Function to find the closest DestructableObject in the scene
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
