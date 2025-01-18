export interface Project {
    name: string;
    version: string;
    private: boolean;
    location: string;
    workspaceDependencies: string[];
    scripts: string[];
}
