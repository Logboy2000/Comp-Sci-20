class_name Player extends CharacterBody2D

enum States {
	NORMAL,
	DASHING,
}
var state = States.NORMAL

const BULLET = preload("res://scenes/objects/bullet.tscn")
const SHOOT_SOUND = preload("res://assets/Audio/shoot.wav")
const DASH_SOUND = preload("res://assets/Audio/dash.wav")

@onready var animation_player: AnimationPlayer = $AnimationPlayer

@onready var sprite: Sprite2D = $Visuals/Sprite2D
@onready var hp_bar: ProgressBar = $Visuals/HpBar

@onready var bullet_shoot_point: Node2D = $BulletShootPoint
@onready var collision_shape: CollisionShape2D = $CollisionShape

@onready var dash_length_timer: Timer = $Timers/DashLengthTimer
@onready var shoot_cooldown_timer: Timer = $Timers/ShootCooldownTimer

@onready var magnet_area: Area2D = $MagnetArea
@onready var dash_destroy_area: Area2D = $DashDestroyArea
@onready var collection_area: Area2D = $CollectionArea


var hp: int = 0
@export var max_hp: int = 10
@export var dash_damage: int = 1
@export var can_die: bool = true

@export_group("Shooting")
@export var bullet_count: int = 1
@export var max_bullet_spread: float = 360.0
@export var recoil: float = 0

@export_group("Movement")
@export var top_speed: float = 60
@export var dash_speed: float = 1000
@export var acceleration: float = 600
@export var deceleration: float = 400
@export var rotation_speed: float = 0.250

var target_angle: float = 0
var input_direction: Vector2 = Vector2.ZERO
var dash_direction: Vector2 = Vector2(1, 1)
var mouse_direction: Vector2

func _ready() -> void:
	GameManager.player = self
	hp = max_hp
	rotation = (get_global_mouse_position() - global_position).angle()

func _process(_delta: float) -> void:
	hp_bar.visible = can_die
	if can_die:
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

	target_angle = mouse_direction.angle()
	rotation = lerp_angle(rotation, target_angle, rotation_speed)

	if input_direction != Vector2.ZERO:
		velocity = velocity.move_toward(input_direction * top_speed, acceleration)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, deceleration)

	if Input.is_action_just_pressed("shoot"):
		shoot(bullet_count)
	if Input.is_action_just_pressed("ability") and state == States.NORMAL and input_direction != Vector2.ZERO:
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
	
	
	var collection_speed: float = 5
	for area in magnet_area.get_overlapping_areas():
		if area is Coin:
			var distance = area.position.distance_to(position)
			var speed = lerp(collection_speed, collection_speed / 4.0, distance / 100.0)  # Faster when closer, slower when further
			area.position = area.position.move_toward(position, speed)
	for area in collection_area.get_overlapping_areas():
		if area is Coin:
			GameManager.coins += 1
			area.queue_free()

	move_and_slide()
	update_debug()
func shoot(count: int):
	GameManager.shake_camera(1)
	AudioPlayer.play_sound(SHOOT_SOUND)
	for i in count:
		var new_bullet = BULLET.instantiate() as Bullet
		new_bullet.position = bullet_shoot_point.global_position

		var spread = 0.0
		if count > 1:
			var spread_factor = min(count / 10.0, 1.0)  # Gradually increase spread up to max at 10 bullets
			spread = max_bullet_spread * spread_factor * (float(i) / (count - 1) - 0.5)

		new_bullet.direction = mouse_direction.rotated(deg_to_rad(spread))
		new_bullet.rotation = new_bullet.direction.angle()
		new_bullet.bullet_speed += velocity.length()
		velocity -= new_bullet.direction * recoil

		add_sibling(new_bullet)



func dash():
	dash_direction = input_direction
	state = States.DASHING
	dash_length_timer.start(0)
	AudioPlayer.play_sound(DASH_SOUND)

func hit(damage: int = 1):
	if can_die:
		GameManager.shake_camera(3)
		hp -= damage
		if hp <= 0:
			die()
			return 0

func heal(damage: int = 1):

	hp += damage
	if hp > max_hp:
		hp = max_hp

func die():
	GameManager.game_over()
	queue_free()

func update_debug():
	DebugMenu.modify_label("pos", "Pos: " + str(round(position.x)) + ", " + str(round(position.y)))
	DebugMenu.modify_label("vel", "Vel: " + str(round(velocity.x)) + ", " + str(round(velocity.y)))
	DebugMenu.modify_label("state", "State: " + str(state))



func _on_dash_length_timer_timeout() -> void:
	state = States.NORMAL
