1. Overview

A 2D action-platformer built with Phaser 3, featuring combat mechanics, dash attacks, enemy AI, collectibles, and dynamic UI elements.
The player explores a tilemap-based level, defeats enemies, avoids traps, and reaches the exit while maintaining health and upgrading abilities.

This project was created as a personal game prototype to explore core platformer systems such as movement, collision, UI, and feedback effects.

2. Core Features
Player Abilities

Smooth horizontal movement with acceleration and drag

Jumping and air dashing with physics-based control

Dash attacks that destroy enemies and enhance dash velocity

Health system with heart-based UI feedback

Enemies & Hazards

Patrolling enemies with timed directional switching

Multiple spike trap types (horizontal & vertical movement)

Collision-based damage and death logic

Collectibles & Progression

Heart pickups restore health and modify player stats

Collectible-based scaling for movement speed and jump height

Persistent data saved between scenes (enemy kills, stats, collectibles)

Visual & Audio Effects

Particle effects for walking and jumping

Sound effects for dashing, collecting, taking damage, and dying

Background music with a toggleable mute function

UI Systems

Dynamic heart UI for player health

Dash readiness icon that updates with cooldown

Two-digit enemy kill counter using tilemap-based digits

3. Technical Breakdown
System	Description
Engine	Phaser 3
Language	JavaScript (ES6)
Map Design	Tiled JSON tilemap with multiple tilesets
Physics	Arcade Physics (custom gravity, tile collisions)
Audio	Phaser Sound Manager for effects & looping music
Particles	Configurable emitters for player motion feedback
Save System	Global state variables to preserve progress

4. Controls
Key	Action
A / D	Move left / right
Space	Jump
W	Dash (ground or air)
R	Restart level
M	Toggle music mute
Q	Toggle physics debug view

5. Design Goals

Learn to combine core gameplay systems (movement, health, AI, UI) cohesively.

Create visual feedback loops that enhance the player experience (particles, sounds, UI changes).

Practice scene management and state persistence between levels.

Develop scalable patterns for enemy behavior and collision responses.

6. Setup & Running
Requirements

open via github pages here:

https://pl0the.github.io/Final-Game-Project-Phaser/

8. Acknowledgments

Phaser 3 Framework by Photon Storm

Kenney.nl for particle assets
