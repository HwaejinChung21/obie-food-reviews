import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from 'src/lib/supabase.admin';

/**
 * Handles profile data operations.
 * Manages user profiles in Supabase, including fetching, creating, and updating profiles.
 */
@Injectable()
export class ProfilesService {

    /**
     * Gets a default display name based on the user's email.
     * @param email - User's email address
     * @returns Default display name derived from the email
     */
    private getDefaultDisplayName(email: string) {
        const atIndex = email.indexOf('@');
        if (atIndex === -1) {
            return email;
        }
        return email.substring(0, atIndex);
    }

    /**
     * Fetches the user's profile from Supabase. If it doesn't exist, creates a new profile with a default display name.
     * @param user - Object containing user ID and email
     * @returns User profile data
     * @throws {InternalServerErrorException} If fetching, creating, or loading the profile fails
     */
    async getOrCreateProfile(user: { id: string, email: string }) {
        
        // try to fetch existing profile
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('id, display_name, created_at, updated_at')
            .eq('id', user.id)
            .maybeSingle();

        if (fetchError) {
            throw new InternalServerErrorException('Failed to fetch profile');
        }

        if (existing) {
            return existing;
        }

        // create new profile if missing
        const displayName = this.getDefaultDisplayName(user.email);
        
        const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({ id: user.id, display_name: displayName });

        if (insertError && insertError.code !== '23505') {
            throw new InternalServerErrorException('Failed to create profile');
        }

        // If duplicate key error, someone else created it - fetch it
        const { data: profile, error: refetchError } = await supabaseAdmin
            .from('profiles')
            .select('id, display_name, created_at, updated_at')
            .eq('id', user.id)
            .single(); 

        if (refetchError || !profile) {
            throw new InternalServerErrorException('Failed to load profile');
        }

        return profile;
    }

    /**
     * Updates the user's display name in their profile.
     * @param id - User's unique identifier
     * @param display_name - New display name to set
     * @returns Updated user profile data
     * @throws {ConflictException} If the new display name is already taken by another user
     * @throws {BadRequestException} If the new display name is invalid (e.g., fails database constraints)
     * @throws {InternalServerErrorException} If the update operation fails for other reasons
     */
    async updateProfileDisplayName(id: string, display_name: string) {
        const { data: updatedProfile, error} = await supabaseAdmin
            .from('profiles')
            .update({ display_name })
            .eq('id', id)
            .select('id, display_name, created_at, updated_at')
            .single();
            
        if (!error && updatedProfile) {
            return updatedProfile;
        }

        if (error?.code === '23505') {
            throw new ConflictException('Display name already taken');
        }

        if (error?.code === '23514') {
            throw new BadRequestException('Invalid display name');
        }

        throw new InternalServerErrorException('Failed to update profile');
    }
}