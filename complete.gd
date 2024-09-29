extends Control

#Quits the game
func _on_quit_game_pressed():
	get_tree().quit()

#Returns player to the home screen
func _on_return_button_pressed():
	get_tree().change_scene_to_file("res://Start Menu/menu.tscn")
