import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './user-settings.entity';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  /**
   * Busca UserSettings por userId
   */
  async getByUserId(userId: number): Promise<UserSettings | null> {
    return await this.userSettingsRepository.findOne({
      where: { userId },
    });
  }

  /**
   * Busca UserSettings por ID da tabela
   */
  async getById(id: number): Promise<UserSettings | null> {
    return await this.userSettingsRepository.findOne({
      where: { id },
    });
  }

  /**
   * Cria UserSettings com posições padrão
   */
  async create(userId: number): Promise<UserSettings> {
    const defaultWidgetPositions = {
      studentsWidget: { x: 59, y: 63, width: 600, height: 300 },
      companiesWidget: { x: 849, y: 64, width: 593, height: 300 },
      counterWidget: { x: 26, y: 418, width: 300, height: 100 },
      statsWidget: { x: 700, y: 424, width: 400, height: 257 },
    };

    const defaultSidebarOrder = [
      'administration',
      'settings',
      'students',
      'director-panel',
      'companies',
      'employment-placement',
      'assessment',
      'control',
      'follow-up',
    ];

    const userSettings = this.userSettingsRepository.create({
      userId,
      widgetPositions: defaultWidgetPositions,
      sidebarOrder: defaultSidebarOrder,
      notes: [],
      monitoredStudents: [],
      favoriteCompanies: [],
      companies: [],
      settings: {
        notifySystem: false,
        notifyEmail: false,
      },
    });

    return await this.userSettingsRepository.save(userSettings);
  }

  /**
   * Atualiza UserSettings
   */
  async update(
    userId: number,
    updateData: Partial<UserSettings>,
  ): Promise<UserSettings> {
    const userSettings = await this.getByUserId(userId);

    if (!userSettings) {
      throw new BadRequestException('UserSettings não encontrado');
    }

    const updated = this.userSettingsRepository.merge(userSettings, updateData);
    return await this.userSettingsRepository.save(updated);
  }

  /**
   * Atualiza UserSettings por ID da tabela
   */
  async updateById(
    id: number,
    updateData: Partial<UserSettings>,
  ): Promise<UserSettings> {
    const userSettings = await this.getById(id);

    if (!userSettings) {
      throw new BadRequestException('UserSettings não encontrado');
    }

    const updated = this.userSettingsRepository.merge(userSettings, updateData);
    return await this.userSettingsRepository.save(updated);
  }

  /**
   * Atualiza posições dos widgets por ID da tabela
   */
  async updateWidgetPositionsById(
    id: number,
    positions: Record<string, any>,
  ): Promise<UserSettings> {
    return await this.updateById(id, { widgetPositions: positions });
  }

  /**
   * Atualiza posições dos widgets
   */
  async updateWidgetPositions(
    userId: number,
    positions: Record<string, any>,
  ): Promise<UserSettings> {
    return await this.update(userId, { widgetPositions: positions });
  }

  /**
   * Atualiza notas
   */
  async updateNotes(userId: number, notes: any[]): Promise<UserSettings> {
    return await this.update(userId, { notes });
  }

  /**
   * Adiciona nota
   */
  async addNote(userId: number, content: string): Promise<UserSettings> {
    const userSettings = await this.getByUserId(userId);

    if (!userSettings) {
      throw new BadRequestException('UserSettings não encontrado');
    }

    const newNote = {
      id: Date.now(),
      content,
    };

    const notes = [...(userSettings.notes || []), newNote];
    return await this.update(userId, { notes });
  }

  /**
   * Remove nota
   */
  async removeNote(userId: number, noteId: number): Promise<UserSettings> {
    const userSettings = await this.getByUserId(userId);

    if (!userSettings) {
      throw new BadRequestException('UserSettings não encontrado');
    }

    const notes = (userSettings.notes || []).filter((note) => note.id !== noteId);
    return await this.update(userId, { notes });
  }
}
