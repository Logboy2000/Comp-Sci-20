extends CharacterBody2D

enum States {
	IDLE,
	WALKING,
	CROUCHING,
	HANGING,
}

@onready var sprite: AnimatedSprite2D = $Sprite
@onready var collision_shape: CollisionShape2D = $CollisionShape

@export var state: States = States.IDLE

@export_category("Movement")
@export var facing_direction: float = 1
@export var gravity: float = 16.0
@export var gravity_scale: float = 1.0
@export var air_speed_multiplier := 0.75
@export var max_fall_speed: float = 180.0

@export_group("Walk")
@export var max_walk_speed: float = 90.0
@export var walk_acceleration := 1000.0
@export var walk_deceleration := 400.0

@export_group("Run")
@export var max_run_speed: float = 90.0
@export var run_acceleration := 1000.0
@export var run_deceleration := 400.0

@export_group("Crouch")
@export var max_crouch_speed: float = 90.0
@export var crouch_acceleration := 1000.0
@export var crouch_deceleration := 400.0

@export_group("Jump")
@export var jump_speed = 300
@export var coyote_time_frames: int
@export var jump_buffer_frames: int

var move_speed_multiplier := 1
var frames_since_grounded: int = 100
var frames_since_jumped: int = 100
var input_direction: Vector2

var can_jump: bool = false
var is_jumping: bool = false
var is_running: bool = false


func _physics_process(delta):
	input_direction = Vector2(Input.get_axis("left", "right"), Input.get_axis("down", "up")) 
	if input_direction.x != 0:
		facing_direction = input_direction.x
	if facing_direction > 0:
		sprite.flip_h = true
	else:
		sprite.flip_h = false
	
	state_machine(delta)
	
	
	
	
	## Jump
	if is_on_floor():
		can_jump = true 
		is_jumping = false
		frames_since_grounded = 0
	else:
		frames_since_grounded += 1
	
	if Input.is_action_just_pressed("jump"):
		frames_since_jumped = 0
	else:
		frames_since_jumped += 1
	
	if frames_since_grounded <= coyote_time_frames and frames_since_jumped <= jump_buffer_frames and can_jump:
		can_jump = false
		velocity.y = -jump_speed
		if Input.is_action_pressed("jump"):
			is_jumping = true
	
	if Input.is_action_just_released("jump") and is_jumping and velocity.y < 0:
		is_jumping = false
		velocity.y *= 0.25
	if velocity.y < 0:
		gravity_scale = 0.5
	else:
		gravity_scale = 1
	
		
	move_and_slide()

func walk(max_speed: float, acceleration:float, deceleration: float, delta: float):
	## Walk
	if (abs(velocity.x) > max_speed and sign(velocity.x) == input_direction.x):
		# Reduce from beyond the max speed
		velocity.x = move_toward(velocity.x, max_speed * input_direction.x, deceleration * move_speed_multiplier * delta)
	else:
		#Approach the max speed
		velocity.x = move_toward(velocity.x, max_speed * input_direction.x, acceleration * move_speed_multiplier * delta)  


func state_machine(delta: float):
	DebugMenu.player_state = state
	match state:
		States.IDLE:
			if input_direction.x != 0:
				state = States.WALKING
			
			apply_gravity()
			walk(max_walk_speed, walk_acceleration, walk_deceleration, delta)
			sprite.animation = "idle"
		States.WALKING:
			if input_direction.x == 0:
				state = States.IDLE
			
			if Input.is_action_pressed("down"):
				state = States.CROUCHING
			
			if Input.is_action_pressed("run"):
				walk(max_run_speed, run_acceleration, run_deceleration, delta)
				sprite.speed_scale = 2
			else:
				walk(max_walk_speed, walk_acceleration, walk_deceleration, delta)
				sprite.speed_scale = 1
			
			apply_gravity()
			if is_on_floor():
				sprite.play("walk")
			else:
				sprite.play("fall")
			
			
		States.CROUCHING:
			if not Input.is_action_pressed("down"):
				state = States.WALKING
			walk(max_crouch_speed, crouch_acceleration, crouch_deceleration, delta)
			
		States.HANGING:
			
			pass

func apply_gravity():
	velocity.y += gravity * gravity_scale
