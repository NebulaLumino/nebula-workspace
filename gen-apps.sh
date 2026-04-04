#!/bin/bash
# Generator script for all 10 Cycle 101 apps

APPS=(
  "ai-personalized-learning-plan:violet:student age, current grade level, subject areas, learning style, academic goals, available study time, challenges, resources"
  "ai-course-syllabus-generator:blue:course title, course level, credits, enrollment capacity, instructor background, semester length, assessment preference, textbook preference"
  "ai-student-progress-report:green:student name, grade level, subjects, assessment scores, class participation, homework completion, behavior notes, teacher notes"
  "ai-quiz-question-bank:amber:topic/subject, grade level, question types needed, difficulty distribution, number of questions, Bloom's taxonomy level, common misconceptions to address"
  "ai-grad-school-application:rose:target programs, undergraduate GPA, research experience, recommenders, statement of purpose topic, test scores, extracurriculars, career goals"
  "ai-differentiated-instruction:teal:subject, grade level, class size, ability range, learning modalities preferred, IEP/504 considerations, time available, available materials"
  "ai-scholarship-match:cyan:student profile, GPA, extracurriculars, family income bracket, intended major, demographic factors, citizenship status, scholarship search budget"
  "ai-microlearning-module:orange:topic, learner audience, time per module, delivery platform, knowledge level, desired outcomes, interactivity preference, compliance requirement"
  "ai-flipped-classroom:pink:topic, grade level, class duration, technology access, student readiness, learning objectives, assessment type, student engagement strategy"
  "ai-iep-generator:violet:disability category, student age/grade, current functioning levels, annual goals priority areas, service minutes, testing accommodations, transition goals, parent concerns"
)

THEME_COLORS=(
  "violet"
  "blue"
  "green"
  "amber"
  "rose"
  "teal"
  "cyan"
  "orange"
  "pink"
  "violet"
)

for i in "${!APPS[@]}"; do
  IFS=':' read -r app color fields <<< "${APPS[$i]}"
  echo "Processing $app (color: $color)"
done