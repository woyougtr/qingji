import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Goal, GoalProgress, Milestone, Achievement } from '@/types'

export const useGoalStore = defineStore('goal', () => {
  const currentGoal = ref<Goal | null>(null)
  const goalProgress = ref<GoalProgress | null>(null)
  const milestones = ref<Milestone[]>([])
  const achievements = ref<Achievement[]>([])

  function setGoal(goal: Goal) {
    currentGoal.value = goal
  }

  function setProgress(progress: GoalProgress) {
    goalProgress.value = progress
  }

  function setMilestones(m: Milestone[]) {
    milestones.value = m
  }

  function setAchievements(a: Achievement[]) {
    achievements.value = a
  }

  function addAchievement(achievement: Achievement) {
    achievements.value.push(achievement)
  }

  function clearGoal() {
    currentGoal.value = null
    goalProgress.value = null
  }

  return {
    currentGoal,
    goalProgress,
    milestones,
    achievements,
    setGoal,
    setProgress,
    setMilestones,
    setAchievements,
    addAchievement,
    clearGoal,
  }
})
