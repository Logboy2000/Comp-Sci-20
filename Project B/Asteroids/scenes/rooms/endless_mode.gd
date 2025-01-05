class_name EndlessRoom extends Room

var difficulty: int = 1

const MUSIC_CHILL = preload("res://assets/audio/music_chill.ogg")

const DESTRUCTABLE_OBJECTS = [
	{
		"scene": preload("res://scenes/objects/asteroids/explosive_asteroid.tscn"),
		"weight": 15
	},
	{
		"scene": preload("res://scenes/objects/asteroids/asteroid.tscn"),
		"weight": 50
	},
	{
		"scene": preload("res://scenes/objects/enemies/enemy_0.tscn"),
		"weight": 100
	},
]


@onready var spawn_timer: Timer = $SpawnTimer
@export var asteroid_speed: float = 0
@export var spawn_delay_seconds: float = 1
@export var difficulty_increase_rate: float = 0.1  # How much to increase difficulty per minute







func _ready() -> void:
	Audio.fade_out_music()
	spawn_timer.wait_time = spawn_delay_seconds
	super._ready()

func _process(delta: float) -> void:
	if not Audio.is_playing_music():
		Audio.play_music(MUSIC_CHILL)
	super._process(delta)

func _on_difficulty_increase_timer_timeout() -> void:
	difficulty += 1


func _on_spawn_timer_timeout() -> void:
	var total_weight = 0
	for obj in DESTRUCTABLE_OBJECTS:
		total_weight += obj["weight"]
	
	var random_value = randf() * total_weight
	var current_weight = 0
	var selected_scene
	
	for obj in DESTRUCTABLE_OBJECTS:
		current_weight += obj["weight"]
		if random_value <= current_weight:
			selected_scene = obj["scene"]
			break
	
	var new_object = selected_scene.instantiate()
	
	new_object.global_position = Vector2(
		randf_range(0, room_size.x),
		randf_range(0, room_size.y)
	)
	
	new_object.linear_velocity = position * asteroid_speed
	
	new_object.angular_velocity = randi_range(-10, 10)
	new_object.spawn_animation = true
	GameManager.add_entity(new_object)
