class_name Player extends CharacterBody2D

enum States {
	NORMAL,
	DASHING
}
var state = States.NORMAL

#scenes
const BULLET = preload("res://scenes/objects/bullet.tscn")
#sfx
const SHOOT_SOUND = preload("res://assets/Audio/shoot.wav")
const DASH_SOUND = preload("res://assets/Audio/dash.wav")

@onready var sprite: Sprite2D = $Sprite2D
@onready var bullet_shoot_point: Node2D = $BulletShootPoint
@onready var collision_shape: CollisionShape2D = $CollisionShape
@onready var dash_length_timer: Timer = $DashLengthTimer
@onready var dash_destroy_area: Area2D = $DashDestroyArea
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var hp_bar: ProgressBar = $HpBar

var hp: int = 4
@export var max_hp: int = 10

@export var top_speed: float = 40
@export var dash_speed: float = 1000
@export var dash_damage: int = 1
@export var rotation_speed: float = 0.250
@export var recoil: float = 0
@export var acceleration: float = 600  # Acceleration rate
@export var deceleration: float = 400  # Deceleration rate
@export var bullet_accuracy: float = 1.0  # 1 is perfect accuracy, 0 is full 360-degree spread

var target_angle: float = 0
var input_direction: Vector2 = Vector2.ZERO
var dash_direction: Vector2 = Vector2(1, 1)
var mouse_direction: Vector2

func _ready() -> void:
	rotation = (get_global_mouse_position() - global_position).angle()
	hp = max_hp

func _process(_delta: float) -> void:
	hp_bar.max_value = max_hp
	hp_bar.value = hp
	var hp_percent: float = float(hp) / float(max_hp)
	if hp_percent < 0.25:
		animation_player.play("damage_flash")
	else:
		animation_player.stop()

func _physics_process(_delta: float) -> void:
	input_direction = Vector2(Input.get_axis("left", "right"), Input.get_axis("up", "down")).normalized()
	mouse_direction = (get_global_mouse_position() - global_position).normalized()
	
	# Calculate the target angle (direction you want to rotate towards)
	target_angle = mouse_direction.angle()
	
	# Smoothly interpolate the current angle towards the target angle
	rotation = lerp_angle(rotation, target_angle, rotation_speed)  # Adjust the speed by changing the factor
	
	# Apply acceleration and deceleration
	if input_direction != Vector2.ZERO:
		velocity = velocity.move_toward(input_direction * top_speed, acceleration)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, deceleration)
	
	
	
	if Input.is_action_just_pressed("shoot") or Input.is_action_pressed("autofire"):
		shoot()
	if Input.is_action_just_pressed("action") and state == States.NORMAL and input_direction != Vector2.ZERO:
		dash()
	
	match state:
		States.NORMAL:
			sprite.modulate = Color(1, 1, 1)
			collision_shape.disabled = false
		States.DASHING:
			sprite.modulate = Color(0, 0, 1)
			velocity = dash_direction * dash_speed
			collision_shape.disabled = true
			
	
	for body in dash_destroy_area.get_overlapping_bodies():
		if body is Asteroid and (velocity.length() > 300):
			body.hit(dash_damage)
	if Input.is_key_pressed(KEY_H):
		hit()
	
		  # White color
	move_and_slide()
	update_debug()



func shoot():
	GameManager.shake_camera(1)
	
	var new_bullet = BULLET.instantiate() as Bullet
	new_bullet.position = bullet_shoot_point.global_position
	new_bullet.rotation = rotation
	new_bullet.bullet_speed += velocity.length()
	
	
	# Calculate the maximum angle offset based on bullet_accuracy
	var max_angle_offset = deg_to_rad(180 * (1.0 - bullet_accuracy))  # 180 degrees at bullet_accuracy 0
	
	# Apply a random angle offset within the calculated range
	var random_angle = randf_range(-max_angle_offset, max_angle_offset)
	var direction_with_offset = mouse_direction.rotated(random_angle)
	
	new_bullet.direction = direction_with_offset.normalized()
	velocity -= new_bullet.direction * recoil
	
	AudioPlayer.play_sound(SHOOT_SOUND)
	add_sibling(new_bullet)



func dash():
	dash_direction = input_direction
	state = States.DASHING
	dash_length_timer.start(0)
	AudioPlayer.play_sound(DASH_SOUND)

func hit(damage: int = 1):
	GameManager.shake_camera(3)
	hp -= damage
	if hp <= 0:
		die()
		return 0
	

func heal(damage: int = 1):
	if (hp + damage) <= sprite.hframes:
		hp += damage
		sprite.frame -= damage

func die():
	GameManager.game_over()
	queue_free()

func update_debug():
	DebugMenu.modify_label("pos","Pos: " + str(round(position.x)) + ", " + str(round(position.y)))
	DebugMenu.modify_label("vel","Vel: " + str(round(velocity.x)) + ", " + str(round(velocity.y)))
	DebugMenu.modify_label("state","State: " + str(state))

func _on_dash_length_timer_timeout() -> void:
	state = States.NORMAL
