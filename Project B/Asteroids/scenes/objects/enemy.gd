class_name Enemy
extends DestructableObject # extends rigidbody2d

@export var do_follow: bool = true
@export var follow_player: bool = false
@export var rotate_toward_velocity: bool = false
@export var follow_speed: float = 1
@export var do_contact_damage: bool = true
@export var contact_damage: int = 1
var follow_target: Node2D = null  

func _ready() -> void:
	super._ready()
	if GameManager.player and follow_player:
		follow_target = GameManager.player

func _physics_process(_delta: float) -> void:
	if follow_target != null and do_follow == true:
		# Calculate direction to the target
		var direction_to_target = (follow_target.global_position - global_position).normalized()
		
		# Set the linear velocity to move toward the target
		linear_velocity += direction_to_target * follow_speed * randf_range(0.95, 1.05)
	
	if rotate_toward_velocity == true:
		rotation = linear_velocity.angle()
	
	
	for body in get_colliding_bodies():
		if body is Player and do_contact_damage:
			body.hit(contact_damage, self)
