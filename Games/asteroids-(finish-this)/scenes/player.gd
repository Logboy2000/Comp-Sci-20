extends RigidBody2D

const BULLET = preload("res://scenes/bullet.tscn")

@onready var sprite_2d: Sprite2D = $Sprite2D
@onready var bullet_shoot_point: Node2D = $BulletShootPoint
@onready var collision_polygon_2d: CollisionPolygon2D = $CollisionPolygon2D

@export var move_speed: float = 40
var target_angle: float = 0


func _ready() -> void:
	pass



func _physics_process(_delta: float) -> void:
	var input_direction: Vector2 = Vector2(Input.get_axis("left", "right"), Input.get_axis("up", "down"))
	look_at(get_global_mouse_position())
	linear_velocity += input_direction * move_speed
	if Input.is_action_pressed("shoot"):
		shoot()
		

func shoot():
	var new_bullet = BULLET.instantiate() as RigidBody2D
	new_bullet.position = bullet_shoot_point.global_position
	new_bullet.rotation = rotation
	
	var direction = (get_global_mouse_position() - new_bullet.position).normalized()
	new_bullet.linear_velocity = direction * 400
	linear_velocity -= direction * 400
	add_sibling(new_bullet)
