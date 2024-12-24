class_name Enemy
extends DestructableObject # extends rigidbody2d

@export var follow_speed: float = 1
@export var do_contact_damage: bool = true
@export var contact_damage: int = 1
var follow_target: Node2D = null  

func _ready() -> void:
	if GameManager.player:
		follow_target = GameManager.player

func _physics_process(_delta: float) -> void:
	if follow_target != null:
		# Calculate direction to the target
		var direction_to_target = (follow_target.global_position - global_position).normalized()
		
		# Set the linear velocity to move toward the target
		linear_velocity += direction_to_target * follow_speed
	
	for body in get_colliding_bodies():
		if body is Player and do_contact_damage:
			body.hit(contact_damage, self)
