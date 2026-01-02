'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, ReactNode } from 'react';
import {
  Tournament,
  TournamentRound,
  TournamentFormat,
  MatchResult,
  RoundType,
  TopcutLevel,
} from '@/types';
import {
  generateId,
  saveTournamentToStorage,
  loadTournamentFromStorage,
} from '@/lib/utils';

// State shape
interface TournamentState {
  tournament: Tournament | null;
  isLoading: boolean;
}

// Round addition payload
interface AddRoundPayload {
  opponentLeaderId: string;
  result: MatchResult;
  roundType: RoundType;
  topcutLevel?: TopcutLevel;
  diceWon?: boolean;
  notes?: string;
}

// Action types
type TournamentAction =
  | { type: 'LOAD_TOURNAMENT'; payload: Tournament | null }
  | { type: 'CREATE_TOURNAMENT'; payload: { title: string; format: TournamentFormat; playerLeaderId: string; date?: string; playerCount?: number } }
  | { type: 'UPDATE_TOURNAMENT'; payload: Partial<Tournament> }
  | { type: 'ADD_ROUND'; payload: AddRoundPayload }
  | { type: 'UPDATE_ROUND'; payload: { roundId: string; updates: Partial<TournamentRound> } }
  | { type: 'DELETE_ROUND'; payload: { roundId: string } }
  | { type: 'RESET_TOURNAMENT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: TournamentState = {
  tournament: null,
  isLoading: true,
};

// Helper to calculate round numbers separately for swiss and topcut
function getNextRoundNumber(rounds: TournamentRound[], roundType: RoundType): number {
  const sameTypeRounds = rounds.filter((r) => r.roundType === roundType);
  return sameTypeRounds.length + 1;
}

// Reducer
function tournamentReducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case 'LOAD_TOURNAMENT':
      return {
        ...state,
        tournament: action.payload,
        isLoading: false,
      };

    case 'CREATE_TOURNAMENT': {
      const now = new Date().toISOString();
      const newTournament: Tournament = {
        id: generateId(),
        title: action.payload.title,
        format: action.payload.format,
        playerLeaderId: action.payload.playerLeaderId,
        rounds: [],
        date: action.payload.date || now,
        playerCount: action.payload.playerCount,
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...state,
        tournament: newTournament,
      };
    }

    case 'UPDATE_TOURNAMENT':
      if (!state.tournament) return state;
      return {
        ...state,
        tournament: {
          ...state.tournament,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
      };

    case 'ADD_ROUND': {
      if (!state.tournament) return state;
      const newRound: TournamentRound = {
        id: generateId(),
        roundNumber: getNextRoundNumber(state.tournament.rounds, action.payload.roundType),
        roundType: action.payload.roundType,
        opponentLeaderId: action.payload.opponentLeaderId,
        result: action.payload.result,
        topcutLevel: action.payload.topcutLevel,
        diceWon: action.payload.diceWon,
        notes: action.payload.notes,
      };
      return {
        ...state,
        tournament: {
          ...state.tournament,
          rounds: [...state.tournament.rounds, newRound],
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_ROUND': {
      if (!state.tournament) return state;
      return {
        ...state,
        tournament: {
          ...state.tournament,
          rounds: state.tournament.rounds.map((round) =>
            round.id === action.payload.roundId
              ? { ...round, ...action.payload.updates }
              : round
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'DELETE_ROUND': {
      if (!state.tournament) return state;
      const roundToDelete = state.tournament.rounds.find(
        (r) => r.id === action.payload.roundId
      );
      if (!roundToDelete) return state;

      // Filter out the deleted round and renumber remaining rounds of the same type
      const filteredRounds = state.tournament.rounds.filter(
        (round) => round.id !== action.payload.roundId
      );

      // Renumber rounds of the same type
      let swissCount = 0;
      let topcutCount = 0;
      const renumberedRounds = filteredRounds.map((round) => {
        if (round.roundType === 'swiss') {
          swissCount++;
          return { ...round, roundNumber: swissCount };
        } else {
          topcutCount++;
          return { ...round, roundNumber: topcutCount };
        }
      });

      return {
        ...state,
        tournament: {
          ...state.tournament,
          rounds: renumberedRounds,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'RESET_TOURNAMENT':
      return {
        ...state,
        tournament: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Context
interface TournamentContextValue {
  state: TournamentState;
  createTournament: (title: string, format: TournamentFormat, playerLeaderId: string, date?: string, playerCount?: number) => void;
  updateTournament: (updates: Partial<Tournament>) => void;
  addRound: (
    opponentLeaderId: string,
    result: MatchResult,
    roundType: RoundType,
    topcutLevel?: TopcutLevel,
    diceWon?: boolean,
    notes?: string
  ) => void;
  updateRound: (roundId: string, updates: Partial<TournamentRound>) => void;
  deleteRound: (roundId: string) => void;
  resetTournament: () => void;
}

const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);

// Provider component
export function TournamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tournamentReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadTournamentFromStorage();
    dispatch({ type: 'LOAD_TOURNAMENT', payload: saved as Tournament | null });
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!state.isLoading && state.tournament) {
      saveTournamentToStorage(state.tournament);
    }
  }, [state.tournament, state.isLoading]);

  const createTournament = useCallback((title: string, format: TournamentFormat, playerLeaderId: string, date?: string, playerCount?: number) => {
    dispatch({ type: 'CREATE_TOURNAMENT', payload: { title, format, playerLeaderId, date, playerCount } });
  }, []);

  const updateTournament = useCallback((updates: Partial<Tournament>) => {
    dispatch({ type: 'UPDATE_TOURNAMENT', payload: updates });
  }, []);

  const addRound = useCallback((
    opponentLeaderId: string,
    result: MatchResult,
    roundType: RoundType,
    topcutLevel?: TopcutLevel,
    diceWon?: boolean,
    notes?: string
  ) => {
    dispatch({
      type: 'ADD_ROUND',
      payload: { opponentLeaderId, result, roundType, topcutLevel, diceWon, notes },
    });
  }, []);

  const updateRound = useCallback((roundId: string, updates: Partial<TournamentRound>) => {
    dispatch({ type: 'UPDATE_ROUND', payload: { roundId, updates } });
  }, []);

  const deleteRound = useCallback((roundId: string) => {
    dispatch({ type: 'DELETE_ROUND', payload: { roundId } });
  }, []);

  const resetTournament = useCallback(() => {
    dispatch({ type: 'RESET_TOURNAMENT' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('riftrecord_tournament');
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      createTournament,
      updateTournament,
      addRound,
      updateRound,
      deleteRound,
      resetTournament,
    }),
    [state, createTournament, updateTournament, addRound, updateRound, deleteRound, resetTournament]
  );

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

// Custom hook for using the context
export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
