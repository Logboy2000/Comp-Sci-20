class_name EndlessRoom extends Room

var difficulty: int = 0

const MUSIC_CHILL = preload("res://assets/audio/music_chill.ogg")

const OBJECTS = [
	{
		"scene": preload("res://scenes/objects/asteroids/asteroid.tscn"),
		"weight": 35,
		"min_difficulty": 1
	},
	{
		"scene": preload("res://scenes/objects/enemies/enemy_0.tscn"),
		"weight": 25,
		"min_difficulty": 1
	},
	
	{
		"scene": preload("res://scenes/objects/enemies/enemy_1.tscn"),
		"weight": 10,
		"min_difficulty": 3
	},
	{
		"scene": preload("res://scenes/objects/asteroids/explosive_asteroid.tscn"),
		"weight": 20,
		"min_difficulty": 5
	},
	{
		"scene": preload("res://scenes/objects/enemies/worm_boss.tscn"),
		"weight": 100,
		"min_difficulty": 1
	},

]

@onready var difficulty_increase_timer: Timer = $DifficultyIncreaseTimer

@onready var spawn_timer: Timer = $SpawnTimer
@export var asteroid_speed: float = 10
@export var spawn_delay_seconds: float = 2
@export var min_spawn_delay_seconds = 0.5

const SPAWN_SOUND = preload("res://assets/audio/spawn.ogg")



func _ready() -> void:
	Audio.fade_out_music()
	increase_difficulty()
	super._ready()

func _process(delta: float) -> void:
	if not Audio.is_playing_music():
		Audio.play_music(MUSIC_CHILL)
	super._process(delta)
	DebugMenu.modify_label("diff_time", "DiffTimer: " + str(snapped(difficulty_increase_timer.time_left, 0.01)))
	
func _on_difficulty_increase_timer_timeout() -> void:
	increase_difficulty()

func increase_difficulty():
	difficulty += 1
	spawn_timer.wait_time = max(spawn_delay_seconds / difficulty, min_spawn_delay_seconds)
	DebugMenu.modify_label("difficulty", "Diff: " + str(difficulty))

func _on_spawn_timer_timeout() -> void:
	# Filter objects by difficulty
	var eligible_objects = []
	for obj in OBJECTS:
		if difficulty >= obj["min_difficulty"]:
			eligible_objects.append(obj)
	
	# If no objects are eligible, do nothing
	if eligible_objects.is_empty():
		return
	
	# Calculate total weight of eligible objects
	var total_weight = 0
	for obj in eligible_objects:
		total_weight += obj["weight"]
	
	# Select a random object based on weight
	var random_value = randf() * total_weight
	var current_weight = 0
	var selected_scene = null
	
	for obj in eligible_objects:
		current_weight += obj["weight"]
		if random_value <= current_weight:
			selected_scene = obj["scene"]
			break
	
	# Spawn the selected object
	if selected_scene:
		Audio.play_sound(SPAWN_SOUND)
		var new_object = selected_scene.instantiate()
		
		new_object.global_position = Vector2(
			randf_range(0, room_size.x),
			randf_range(0, room_size.y)
		)
		if new_object is DestructableObject:
			new_object.linear_velocity = Vector2(randf_range(-1,1),randf_range(-1,1)) * asteroid_speed
			new_object.angular_velocity = randi_range(-10, 10)
			new_object.spawn_animation = true
		
		GameManager.add_entity(new_object)
