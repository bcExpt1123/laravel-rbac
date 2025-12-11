<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Clear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $commands = [
            "cache:clear",
            "view:clear",
            "schedule:clear-cache",
            "route:clear",
            "queue:clear",
            "permission:cache-reset",
            "optimize:clear",
            "event:clear",
            "config:clear"
        ];
        foreach($commands as $c){
            $this->call($c);
        }
    }
}
