class_name Player extends CharacterBody2D

signal player_hurt

enum States {
	NORMAL,
	DASHING,
}
var state = States.NORMAL
#objects
const BULLET = preload("res://scenes/objects/projectiles/bullet.tscn")
const EXPLOSION = preload("res://scenes/objects/explosion.tscn")
#sounds
const SHOOT_SOUND = preload("res://assets/Audio/shoot.ogg")
const DASH_SOUND = preload("res://assets/Audio/dash.ogg")
const PLAYER_HIT_SOUND = preload("res://assets/Audio/player_hit.ogg")
const COIN_SOUNDS = [
	preload("res://assets/Audio/coin1.ogg"),
	preload("res://assets/Audio/coin2.ogg"),
	preload("res://assets/Audio/coin3.ogg"),
	preload("res://assets/Audio/coin4.ogg"),
	preload("res://assets/Audio/coin5.ogg")
]

@onready var animation_player: AnimationPlayer = $AnimationPlayer

@onready var sprite: Sprite2D = $Visuals/Sprite2D

@onready var bullet_shoot_point: Node2D = $BulletShootPoint
@onready var collision_shape: CollisionShape2D = $CollisionShape

@onready var dash_length_timer: Timer = $Timers/DashLengthTimer
@onready var shoot_cooldown_timer: Timer = $Timers/ShootCooldownTimer

@onready var magnet_area: Area2D = $MagnetArea
@onready var magnet_collision_shape: CollisionShape2D = $MagnetArea/MagnetCollisionShape

@onready var dash_destroy_area: Area2D = $DashDestroyArea
@onready var collection_area: Area2D = $CollectionArea

@export var player_index: int = 1
@export var keyboard_only_controls = false

@export_group("Health")
@export var starting_max_hp: int = 20
@export var can_die: bool = true
@export var invincibility_frames: int = 30
var remaining_invincibility_frames: int
var hit_this_frame: bool = false
var hp: int = 0
var max_hp: int = 0
var vulnerable: bool = true
var in_danger: bool = false

@export_group("Shooting")
@export var bullet_count: int = 1
@export var max_bullet_spread: float = 360.0
@export var recoil: float = 0
var can_shoot: bool = true

@export_group("Movement")
var top_speed: float = 0
@export var starting_top_speed: float = 120
@export var min_dash_speed: float = 800
@export var max_dash_speed: float = 2000
@export var acceleration: float = 40
@export var deceleration: float = 400
@export var rotation_speed: float = 0.250

@export_group("Dash")
@export var dash_mult: float = 1
@export var dash_damage: float = 10
@export var dash_knockback: float = 3
var velocity_at_start_of_dash: Vector2  # what else do i name this



#input
var target_angle: float = 0
var input_direction: Vector2 = Vector2.ZERO
var dash_direction: Vector2 = Vector2(1, 1)
var mouse_direction: Vector2

func _ready() -> void:
	GameManager.player = self
	max_hp = starting_max_hp
	hp = max_hp
	top_speed = starting_top_speed
	remaining_invincibility_frames = invincibility_frames
	rotation = (get_global_mouse_position() - global_position).angle()



func _physics_process(_delta: float) -> void:
	# Input
	input_direction = Vector2(Input.get_axis("left", "right"), Input.get_axis("up", "down")).normalized()
	mouse_direction = (get_global_mouse_position() - global_position).normalized()
	if keyboard_only_controls:
		target_angle = input_direction.angle()
	else:
		target_angle = mouse_direction.angle()
	rotation = lerp_angle(rotation, target_angle, rotation_speed)
	if input_direction != Vector2.ZERO:
		velocity = velocity.move_toward(input_direction * top_speed, acceleration)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, deceleration)
	if Input.is_action_pressed("shoot") and can_shoot:
		shoot_cooldown_timer.wait_time = 10/float(Upgrades.get_level("fire_rate"))
		shoot_cooldown_timer.start()
		can_shoot = false
		shoot(bullet_count)
	if Input.is_action_just_pressed("ability") and state == States.NORMAL and input_direction != Vector2.ZERO:
		dash()
	if Input.is_action_just_pressed("die"):
		hit(max_hp, self)
	
	if can_die:
		var hp_percent: float = float(hp) / float(max_hp)
		if hp_percent < 0.25:
			in_danger = true
			animation_player.play("damage_flash")
		else:
			in_danger = false
	
	remaining_invincibility_frames -= 1
	
	
	#states
	match state:
		States.NORMAL:
			sprite.modulate = Color(1, 1, 1)
			collision_shape.disabled = false
			vulnerable = true
		States.DASHING:
			sprite.modulate = Color(0, 0, 1)
			# jank as hell dash speed cap thingy
			velocity = dash_direction * min(max(dash_mult * top_speed, min_dash_speed), max_dash_speed)
			vulnerable = false
	
	#apply upgrades
	magnet_collision_shape.shape.radius = (Upgrades.get_level("magnet_radius") * 30) + 50
	bullet_count = Upgrades.get_level("multishot")
	top_speed = (Upgrades.get_level("speed") * 20) + starting_top_speed
	# collisions
	for body in dash_destroy_area.get_overlapping_bodies():
		if (body is DestructableObject) and (state == States.DASHING):
			body.hit(dash_damage, self, dash_knockback)
	
	var collection_speed: float = 20
	for area in magnet_area.get_overlapping_areas():
		if area is Coin:
			var distance = area.position.distance_to(position)
			var speed = lerp(collection_speed, collection_speed / 4.0, distance / magnet_collision_shape.shape.radius)
			area.position = area.position.move_toward(position, speed)
		if area is Bullet:
			if area.bullet_owner == Bullet.BulletOwner.ENEMY:
				hit(1, area)
	
	for area in collection_area.get_overlapping_areas():
		if area is Coin:
			GameManager.change_coins_by(round(Upgrades.get_level("greed") * area.value))
			area.queue_free()
			AudioPlayer.play_sound(COIN_SOUNDS.pick_random())
	
	
	# actually move and shit
	move_and_slide()
	
	# various debug
	update_debug()

func shoot(count: int):
	AudioPlayer.play_sound(SHOOT_SOUND)
	for i in count:
		var new_bullet = BULLET.instantiate() as Bullet
		new_bullet.bullet_owner = Bullet.BulletOwner.PLAYER
		new_bullet.position = bullet_shoot_point.global_position
		var spread = 0.0
		if count > 1:
			var spread_factor = min(count / 10.0, 1.0)  # increase spread up to max at 10 bullets
			spread = max_bullet_spread * spread_factor * (float(i) / (count - 1) - 0.5)
		new_bullet.direction = mouse_direction.rotated(deg_to_rad(spread))
		new_bullet.rotation = new_bullet.direction.angle()
		new_bullet.bullet_speed += velocity.length()
		velocity -= new_bullet.direction * recoil

		add_sibling(new_bullet)



func dash():
	dash_direction = input_direction
	state = States.DASHING
	velocity_at_start_of_dash = velocity
	dash_length_timer.start(0)
	AudioPlayer.play_sound(DASH_SOUND)



func hit(damage: int, damage_source_node: Node2D):
	if can_die == true and vulnerable == true and remaining_invincibility_frames <= 0:
		remaining_invincibility_frames = invincibility_frames
		player_hurt.emit()
		GameManager.shake_camera(8)
		AudioPlayer.play_sound(PLAYER_HIT_SOUND)
		animation_player.play("damage_flash")
		
		# Calculate direction away from the damage source
		var direction_away = (global_position - damage_source_node.global_position).normalized()
		var knockback_force = 600
		
		# Apply knockback to velocity
		velocity += direction_away * knockback_force
		
		# Apply damage
		hp -= damage
		if hp <= 0:
			die()

func heal(damage: int = 1):

	hp += damage
	if hp > max_hp:
		hp = max_hp

func die():
	if can_die:
		GameManager.game_over()
		var explosion = EXPLOSION.instantiate()
		explosion.position = position
		call_deferred("add_sibling", explosion)
		queue_free()

func update_debug():
	DebugMenu.modify_label("pos", "Pos: " + str(round(position.x)) + ", " + str(round(position.y)))
	DebugMenu.modify_label("vel", "Vel: " + str(round(velocity.x)) + ", " + str(round(velocity.y)))
	DebugMenu.modify_label("state", "State: " + str(state))
	DebugMenu.modify_label("inv_frames", "IFrames: " + str(remaining_invincibility_frames))



func _on_dash_length_timer_timeout() -> void:
	state = States.NORMAL


func _on_shoot_cooldown_timer_timeout() -> void:
	can_shoot = true
