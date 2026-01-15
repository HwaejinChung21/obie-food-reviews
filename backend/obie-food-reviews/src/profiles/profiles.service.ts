import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from 'src/lib/supabase.admin';

@Injectable()
export class ProfilesService {

    private getDefaultDisplayName(email: string) {
        const atIndex = email.indexOf('@');
        if (atIndex === -1) {
            return email;
        }
        return email.substring(0, atIndex);
    }

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
}