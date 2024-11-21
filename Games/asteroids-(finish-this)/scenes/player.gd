class_name Player extends RigidBody2D

#scenes
const BULLET = preload("res://scenes/bullet.tscn")

#sfx
const SHOOT_SOUND = preload("res://assets/Audio/shoot.wav")

@onready var sprite_2d: Sprite2D = $Sprite2D
@onready var bullet_shoot_point: Node2D = $BulletShootPoint
@onready var collision_polygon_2d: CollisionPolygon2D = $CollisionPolygon2D

@export var move_speed: float = 40
@export var rotation_speed: float = 0.250
@export var recoil: float = 0

var target_angle: float = 0


func _ready() -> void:
	DebugMenu.add_label("Position")



func _physics_process(_delta: float) -> void:
	var input_direction: Vector2 = Vector2(Input.get_axis("left", "right"), Input.get_axis("up", "down"))
	
	# Calculate the target angle (direction you want to rotate towards)
	target_angle = (get_global_mouse_position() - global_position).angle()
	# Smoothly interpolate the current angle towards the target angle
	rotation = lerp_angle(rotation, target_angle, rotation_speed)  # Adjust the speed by changing the 5 factor
	# Apply movement
	linear_velocity += input_direction * move_speed
	if Input.is_action_just_pressed("shoot") or Input.is_key_pressed(KEY_1):
		shoot()
	
	update_debug()

func shoot():
	var new_bullet = BULLET.instantiate() as RigidBody2D
	new_bullet.position = bullet_shoot_point.global_position
	new_bullet.rotation = rotation
	new_bullet.direction = (get_global_mouse_position() - position + Vector2(randf_range(-22, 22),randf_range(-22, 22))).normalized()
	
	linear_velocity -= new_bullet.direction * recoil
	AudioPlayer.play_sound(SHOOT_SOUND)
	
	add_sibling(new_bullet)

func update_debug():
	DebugMenu.modify_label("Position", str(round(position.x)) +", "+ str(round(position.y)))
