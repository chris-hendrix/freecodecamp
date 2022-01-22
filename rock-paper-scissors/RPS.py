# The example function below keeps track of the opponent's history and plays whatever the opponent played two plays ago. It is not a very good player so you will need to change the code to pass the challenge.
import numpy as np
from itertools import product

# global storage
matrix = {}
states = ['R', 'P', 'S']
guesses = ['P', 'S', 'R']


def player(prev_play, opponent_history=[]):
    opponent_history.append(prev_play)
    global matrix

    # hyper paramaters
    order = 4
    decay = 1
    initial_count = 3

    # get string paramaters from history
    hist = ''.join(opponent_history)
    prev_plays = hist[-1*order-1:]
    prev_pattern = prev_plays[0:order]
    curr_pattern = hist[-1*order:]

    # reset matrix
    if len(opponent_history)==1: matrix = create_matrix(guesses, order, initial_count)

    # return initial guesses if not enough data
    if len(opponent_history) <= order or prev_play=='': return np.random.choice(np.array(states))

    # update matrix
    update_matrix(matrix, prev_play, prev_pattern, decay)
    # print(matrix)

    # guess
    index = matrix[curr_pattern].argmax()
    guess = guesses[index]
    return guess

def update_matrix(matrix, prev_play, prev_pattern, decay = 1.0):
  
  # decay the matrix
  for pat in matrix:
    matrix[pat] = decay*matrix[pat]

  # add to the count
  index = states.index(prev_play)
  matrix[prev_pattern][index] += 1


def create_matrix(list, order, initial_count = 0):
  combos = [''.join(i) for i in product(list, repeat = order)]
  result = {}

  # setup initial array
  for c in combos:
    probs = []
    for s in list:
      probs.append(3)
    result[c] = np.array(probs)

    # normalize probs


  return result
