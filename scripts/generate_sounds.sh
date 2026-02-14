#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p public/assets/sounds

# 1. Tap: A soft, short "woodblock" style click
# Sine wave at 800Hz with quick decay
ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.1" -af "adeclick,afade=t=out:st=0:d=0.1" public/assets/sounds/tap.mp3

# 2. Brush: A soft "swish" sound (pink noise with lowpass filter)
ffmpeg -y -f lavfi -i "anoisesrc=d=0.3:c=pink:r=44100" -af "lowpass=f=3000,afade=t=in:st=0:d=0.05,afade=t=out:st=0.25:d=0.05,volume=0.5" public/assets/sounds/brush.mp3

# 3. Pop (Fill): A happy "bloop" sound
# Sine sweep from 400Hz to 600Hz
ffmpeg -y -f lavfi -i "sine=frequency=400:duration=0.15" -af "apulsator=hz=1,asetrate=44100*1.5,afade=t=out:st=0.1:d=0.05" public/assets/sounds/pop.mp3

# 4. Success: A happy major chord (C-E-G) "Ta-da!"
# Mix three sine waves: C5 (523.25), E5 (659.25), G5 (783.99)
ffmpeg -y \
  -f lavfi -i "sine=frequency=523.25:duration=0.6" \
  -f lavfi -i "sine=frequency=659.25:duration=0.6" \
  -f lavfi -i "sine=frequency=783.99:duration=0.6" \
  -filter_complex "[0:a]afade=t=out:st=0.4:d=0.2[a1];[1:a]afade=t=out:st=0.4:d=0.2[a2];[2:a]afade=t=out:st=0.4:d=0.2[a3];[a1][a2][a3]amix=inputs=3:duration=first,volume=0.6" \
  public/assets/sounds/success.mp3

echo "Sound generation complete! Files saved to public/assets/sounds/"
